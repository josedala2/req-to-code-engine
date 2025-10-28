-- Adicionar novos campos à tabela produtores
ALTER TABLE public.produtores
ADD COLUMN IF NOT EXISTS identificacao_fazenda TEXT,
ADD COLUMN IF NOT EXISTS georeferencia TEXT,
ADD COLUMN IF NOT EXISTS provincia TEXT,
ADD COLUMN IF NOT EXISTS municipio TEXT,
ADD COLUMN IF NOT EXISTS comuna TEXT,
ADD COLUMN IF NOT EXISTS forma_aquisicao TEXT CHECK (forma_aquisicao IN ('heranca', 'comprada', 'ocupacao')),
ADD COLUMN IF NOT EXISTS tipo_producao TEXT CHECK (tipo_producao IN ('com_sombra', 'sem_sombra')),
ADD COLUMN IF NOT EXISTS trabalhadores_efetivos_homens INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS trabalhadores_efetivos_mulheres INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS trabalhadores_colaboradores_homens INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS trabalhadores_colaboradores_mulheres INTEGER DEFAULT 0;