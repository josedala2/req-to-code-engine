-- Criar tabela de auditorias
CREATE TABLE public.auditorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  lote_id UUID REFERENCES public.lotes(id) ON DELETE CASCADE,
  produtor_id UUID REFERENCES public.produtores(id) ON DELETE CASCADE,
  data_auditoria DATE NOT NULL,
  auditor_nome TEXT NOT NULL,
  auditor_certificacao TEXT,
  tipo_auditoria TEXT NOT NULL,
  status TEXT DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'concluida', 'aprovada', 'reprovada')),
  
  -- Critérios de avaliação
  criterios_avaliados JSONB DEFAULT '[]'::jsonb,
  pontuacao_total NUMERIC,
  pontuacao_maxima NUMERIC,
  
  -- Conformidades e não conformidades
  conformidades TEXT[],
  nao_conformidades TEXT[],
  observacoes TEXT,
  recomendacoes TEXT,
  
  -- Resultado final
  resultado TEXT,
  certificado_emitido BOOLEAN DEFAULT false,
  validade_certificado DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.auditorias ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Admins podem visualizar todas auditorias"
ON public.auditorias
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem inserir auditorias"
ON public.auditorias
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar auditorias"
ON public.auditorias
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar auditorias"
ON public.auditorias
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_auditorias_updated_at
BEFORE UPDATE ON public.auditorias
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_auditorias_lote_id ON public.auditorias(lote_id);
CREATE INDEX idx_auditorias_produtor_id ON public.auditorias(produtor_id);
CREATE INDEX idx_auditorias_data ON public.auditorias(data_auditoria);
CREATE INDEX idx_auditorias_status ON public.auditorias(status);