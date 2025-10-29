-- Criar tabela para certificados de exportação
CREATE TABLE public.certificados_exportacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_certificado TEXT NOT NULL UNIQUE,
  produtor_id UUID REFERENCES public.produtores(id),
  lotes_ids UUID[] NOT NULL,
  data_solicitacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data_emissao TIMESTAMP WITH TIME ZONE,
  data_validade DATE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'emitido')),
  destino_pais TEXT NOT NULL,
  destino_cidade TEXT,
  importador_nome TEXT NOT NULL,
  importador_documento TEXT,
  quantidade_total NUMERIC NOT NULL,
  unidade TEXT NOT NULL DEFAULT 'kg',
  valor_total NUMERIC,
  moeda TEXT DEFAULT 'AOA',
  normas_cumpridas TEXT[],
  observacoes TEXT,
  documento_url TEXT,
  aprovado_por UUID REFERENCES auth.users(id),
  aprovado_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.certificados_exportacao ENABLE ROW LEVEL SECURITY;

-- Policies para certificados_exportacao
CREATE POLICY "Admins podem ver todos certificados"
ON public.certificados_exportacao
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem inserir certificados"
ON public.certificados_exportacao
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar certificados"
ON public.certificados_exportacao
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem deletar certificados"
ON public.certificados_exportacao
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Função para gerar número de certificado de exportação
CREATE OR REPLACE FUNCTION public.generate_certificado_exportacao_numero()
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
        SUBSTRING(numero_certificado FROM 'EXP-' || current_year || '-(\d+)')
        AS INTEGER
      )
    ),
    0
  ) INTO next_number
  FROM public.certificados_exportacao
  WHERE numero_certificado LIKE 'EXP-' || current_year || '-%';
  
  next_number := next_number + 1;
  new_numero := 'EXP-' || current_year || '-' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN new_numero;
END;
$$;

-- Trigger para gerar número automaticamente
CREATE OR REPLACE FUNCTION public.set_certificado_exportacao_numero()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.numero_certificado IS NULL OR NEW.numero_certificado = '' THEN
    NEW.numero_certificado := public.generate_certificado_exportacao_numero();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_certificado_exportacao_numero
BEFORE INSERT ON public.certificados_exportacao
FOR EACH ROW
EXECUTE FUNCTION public.set_certificado_exportacao_numero();

-- Trigger para atualizar updated_at
CREATE TRIGGER update_certificados_exportacao_updated_at
BEFORE UPDATE ON public.certificados_exportacao
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Comentários
COMMENT ON TABLE public.certificados_exportacao IS 'Certificados de autorização de exportação de café';
COMMENT ON COLUMN public.certificados_exportacao.lotes_ids IS 'Array de IDs dos lotes incluídos no certificado';
COMMENT ON COLUMN public.certificados_exportacao.normas_cumpridas IS 'Lista de normas e certificações cumpridas pelos lotes';