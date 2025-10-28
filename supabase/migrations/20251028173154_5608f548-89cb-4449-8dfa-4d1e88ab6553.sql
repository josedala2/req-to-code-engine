-- Criar tabela de certificações
CREATE TABLE public.certificacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  produtor_id UUID REFERENCES public.produtores(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  certificadora TEXT NOT NULL,
  numero_certificado TEXT NOT NULL,
  data_emissao DATE NOT NULL,
  data_validade DATE NOT NULL,
  escopo TEXT NOT NULL,
  normas TEXT[] DEFAULT '{}',
  requisitos TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'pendente', 'expirada', 'suspensa', 'renovacao')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Criar tabela de histórico de certificações
CREATE TABLE public.certificacoes_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certificacao_id UUID REFERENCES public.certificacoes(id) ON DELETE CASCADE NOT NULL,
  tipo_alteracao TEXT NOT NULL CHECK (tipo_alteracao IN ('criacao', 'renovacao', 'atualizacao', 'mudanca_status', 'suspensao')),
  status_anterior TEXT,
  status_novo TEXT,
  data_alteracao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  alterado_por UUID REFERENCES auth.users(id),
  observacoes TEXT,
  dados_alteracao JSONB
);

-- Criar tabela de auditorias de certificação
CREATE TABLE public.certificacoes_auditorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certificacao_id UUID REFERENCES public.certificacoes(id) ON DELETE CASCADE NOT NULL,
  data_auditoria DATE NOT NULL,
  auditor TEXT NOT NULL,
  resultado TEXT NOT NULL CHECK (resultado IN ('aprovado', 'aprovado_com_observacoes', 'reprovado')),
  pontuacao NUMERIC,
  nao_conformidades TEXT[] DEFAULT '{}',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.certificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificacoes_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificacoes_auditorias ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para certificacoes
CREATE POLICY "Admins podem visualizar todas certificações"
  ON public.certificacoes FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem inserir certificações"
  ON public.certificacoes FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar certificações"
  ON public.certificacoes FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar certificações"
  ON public.certificacoes FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para certificacoes_historico
CREATE POLICY "Admins podem visualizar histórico"
  ON public.certificacoes_historico FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem inserir histórico"
  ON public.certificacoes_historico FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para certificacoes_auditorias
CREATE POLICY "Admins podem visualizar auditorias"
  ON public.certificacoes_auditorias FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem inserir auditorias"
  ON public.certificacoes_auditorias FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE TRIGGER update_certificacoes_updated_at
  BEFORE UPDATE ON public.certificacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para registrar histórico automaticamente
CREATE OR REPLACE FUNCTION public.registrar_historico_certificacao()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.certificacoes_historico (
      certificacao_id,
      tipo_alteracao,
      status_novo,
      alterado_por,
      observacoes
    ) VALUES (
      NEW.id,
      'criacao',
      NEW.status,
      auth.uid(),
      'Certificação criada'
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO public.certificacoes_historico (
      certificacao_id,
      tipo_alteracao,
      status_anterior,
      status_novo,
      alterado_por,
      observacoes
    ) VALUES (
      NEW.id,
      'mudanca_status',
      OLD.status,
      NEW.status,
      auth.uid(),
      'Status alterado'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger para registrar histórico
CREATE TRIGGER trigger_historico_certificacao
  AFTER INSERT OR UPDATE ON public.certificacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.registrar_historico_certificacao();