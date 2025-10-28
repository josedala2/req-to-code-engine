-- Criar tabela de empresas
CREATE TABLE public.empresas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_empresa TEXT NOT NULL,
  nif TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  endereco TEXT NOT NULL,
  cidade TEXT NOT NULL,
  provincia TEXT NOT NULL,
  responsavel_nome TEXT NOT NULL,
  responsavel_cargo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar enum para tipos de certificação
CREATE TYPE public.tipo_certificacao AS ENUM (
  'organico',
  'fair_trade',
  'rainforest_alliance',
  'utz',
  'cafe_especial'
);

-- Criar enum para status do pedido
CREATE TYPE public.status_pedido_certificacao AS ENUM (
  'pendente',
  'documentacao_analise',
  'auditoria_agendada',
  'auditoria_realizada',
  'em_emissao',
  'concluido',
  'rejeitado'
);

-- Criar tabela de pedidos de certificação
CREATE TABLE public.pedidos_certificacao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
  numero_pedido TEXT NOT NULL UNIQUE,
  tipo_certificacao tipo_certificacao NOT NULL,
  quantidade_lotes INTEGER NOT NULL,
  volume_estimado NUMERIC NOT NULL,
  unidade_volume TEXT NOT NULL,
  observacoes TEXT,
  status status_pedido_certificacao NOT NULL DEFAULT 'pendente',
  data_solicitacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data_conclusao TIMESTAMP WITH TIME ZONE,
  documentos_enviados JSONB DEFAULT '[]',
  certificado_url TEXT,
  selos_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de histórico de status
CREATE TABLE public.historico_pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES public.pedidos_certificacao(id) ON DELETE CASCADE NOT NULL,
  status_anterior status_pedido_certificacao,
  status_novo status_pedido_certificacao NOT NULL,
  observacoes TEXT,
  alterado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Função para gerar número de pedido
CREATE OR REPLACE FUNCTION public.generate_pedido_numero()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  new_numero TEXT;
  current_year TEXT;
BEGIN
  current_year := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(
    MAX(
      CAST(
        SUBSTRING(numero_pedido FROM 'CERT-' || current_year || '-(\d+)')
        AS INTEGER
      )
    ),
    0
  ) INTO next_number
  FROM public.pedidos_certificacao
  WHERE numero_pedido LIKE 'CERT-' || current_year || '-%';
  
  next_number := next_number + 1;
  new_numero := 'CERT-' || current_year || '-' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN new_numero;
END;
$$;

-- Trigger para gerar número de pedido automaticamente
CREATE OR REPLACE FUNCTION public.set_pedido_numero()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.numero_pedido IS NULL OR NEW.numero_pedido = '' THEN
    NEW.numero_pedido := public.generate_pedido_numero();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_pedido_numero_trigger
BEFORE INSERT ON public.pedidos_certificacao
FOR EACH ROW
EXECUTE FUNCTION public.set_pedido_numero();

-- Trigger para registrar histórico de mudanças de status
CREATE OR REPLACE FUNCTION public.registrar_historico_pedido()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.historico_pedidos (
      pedido_id,
      status_novo,
      alterado_por,
      observacoes
    ) VALUES (
      NEW.id,
      NEW.status,
      auth.uid(),
      'Pedido criado'
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO public.historico_pedidos (
      pedido_id,
      status_anterior,
      status_novo,
      alterado_por,
      observacoes
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      auth.uid(),
      'Status alterado'
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER registrar_historico_pedido_trigger
AFTER INSERT OR UPDATE ON public.pedidos_certificacao
FOR EACH ROW
EXECUTE FUNCTION public.registrar_historico_pedido();

-- Trigger para atualizar updated_at
CREATE TRIGGER update_empresas_updated_at
BEFORE UPDATE ON public.empresas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at
BEFORE UPDATE ON public.pedidos_certificacao
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos_certificacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_pedidos ENABLE ROW LEVEL SECURITY;

-- RLS Policies para empresas
CREATE POLICY "Empresas podem ver seus próprios dados"
ON public.empresas
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Empresas podem atualizar seus próprios dados"
ON public.empresas
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Qualquer autenticado pode inserir empresa"
ON public.empresas
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas empresas"
ON public.empresas
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar todas empresas"
ON public.empresas
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies para pedidos
CREATE POLICY "Empresas podem ver seus próprios pedidos"
ON public.pedidos_certificacao
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.empresas
    WHERE empresas.id = pedidos_certificacao.empresa_id
    AND empresas.user_id = auth.uid()
  )
);

CREATE POLICY "Empresas podem criar pedidos"
ON public.pedidos_certificacao
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.empresas
    WHERE empresas.id = pedidos_certificacao.empresa_id
    AND empresas.user_id = auth.uid()
  )
);

CREATE POLICY "Admins podem ver todos pedidos"
ON public.pedidos_certificacao
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar todos pedidos"
ON public.pedidos_certificacao
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies para histórico
CREATE POLICY "Empresas podem ver histórico de seus pedidos"
ON public.historico_pedidos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.pedidos_certificacao
    JOIN public.empresas ON empresas.id = pedidos_certificacao.empresa_id
    WHERE pedidos_certificacao.id = historico_pedidos.pedido_id
    AND empresas.user_id = auth.uid()
  )
);

CREATE POLICY "Admins podem ver todo histórico"
ON public.historico_pedidos
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem inserir histórico"
ON public.historico_pedidos
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Comentários
COMMENT ON TABLE public.empresas IS 'Empresas que solicitam certificações';
COMMENT ON TABLE public.pedidos_certificacao IS 'Pedidos de certificação e auditoria';
COMMENT ON TABLE public.historico_pedidos IS 'Histórico de mudanças de status dos pedidos';