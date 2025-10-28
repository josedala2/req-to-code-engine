-- Adicionar campos de documentos e aprovação na tabela empresas
ALTER TABLE public.empresas
ADD COLUMN IF NOT EXISTS documento_certidao TEXT,
ADD COLUMN IF NOT EXISTS documento_nif TEXT,
ADD COLUMN IF NOT EXISTS documento_alvara TEXT,
ADD COLUMN IF NOT EXISTS documento_outros TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
ADD COLUMN IF NOT EXISTS aprovado_por UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS aprovado_em TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS observacoes_aprovacao TEXT;

-- Criar índice para buscas por status
CREATE INDEX IF NOT EXISTS idx_empresas_status ON public.empresas(status);