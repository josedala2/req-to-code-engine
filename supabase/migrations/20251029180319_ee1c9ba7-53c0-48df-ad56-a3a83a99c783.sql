-- Criar tabela de ofertas de venda para marketplace
CREATE TABLE public.ofertas_venda (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  produtor_id UUID REFERENCES public.produtores(id) ON DELETE CASCADE,
  lote_id UUID REFERENCES public.lotes(id) ON DELETE SET NULL,
  
  -- Informações do produto
  titulo TEXT NOT NULL,
  descricao TEXT,
  variedade TEXT[] NOT NULL DEFAULT '{}',
  processo TEXT NOT NULL,
  
  -- Quantidade e disponibilidade
  quantidade_disponivel NUMERIC NOT NULL,
  unidade TEXT NOT NULL DEFAULT 'kg',
  
  -- Status e certificação
  status_cafe TEXT NOT NULL, -- 'colhido', 'processado', 'verde', 'torrado'
  status_oferta TEXT NOT NULL DEFAULT 'disponivel', -- 'disponivel', 'em_negociacao', 'vendido', 'inativo'
  certificado BOOLEAN DEFAULT false,
  tipo_certificacao TEXT[],
  
  -- Qualidade
  nota_qualidade NUMERIC,
  classificacao TEXT,
  descritores TEXT[],
  peneira TEXT,
  umidade NUMERIC,
  
  -- Preço e negociação
  preco_sugerido NUMERIC,
  moeda TEXT DEFAULT 'AOA',
  negociavel BOOLEAN DEFAULT true,
  
  -- Localização e origem
  provincia TEXT NOT NULL,
  municipio TEXT,
  altitude TEXT,
  fazenda TEXT,
  
  -- Contato
  contato_nome TEXT NOT NULL,
  contato_telefone TEXT NOT NULL,
  contato_email TEXT,
  contato_whatsapp TEXT,
  
  -- Datas
  data_colheita DATE,
  data_disponibilidade DATE,
  validade_oferta DATE,
  
  -- Documentação
  fotos_urls TEXT[],
  documentos_urls TEXT[],
  
  -- Observações adicionais
  observacoes TEXT,
  condicoes_venda TEXT,
  
  -- Metadados
  visualizacoes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE public.ofertas_venda ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (compradores sem login)
CREATE POLICY "Qualquer pessoa pode visualizar ofertas ativas"
ON public.ofertas_venda
FOR SELECT
USING (status_oferta IN ('disponivel', 'em_negociacao'));

-- Política para produtores criarem ofertas (via admin ou sistema de empresas)
CREATE POLICY "Admins podem inserir ofertas"
ON public.ofertas_venda
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Política para produtores atualizarem suas próprias ofertas
CREATE POLICY "Admins podem atualizar ofertas"
ON public.ofertas_venda
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Política para deletar ofertas
CREATE POLICY "Admins podem deletar ofertas"
ON public.ofertas_venda
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_ofertas_venda_updated_at
BEFORE UPDATE ON public.ofertas_venda
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índices para melhor performance
CREATE INDEX idx_ofertas_status ON public.ofertas_venda(status_oferta);
CREATE INDEX idx_ofertas_provincia ON public.ofertas_venda(provincia);
CREATE INDEX idx_ofertas_produtor ON public.ofertas_venda(produtor_id);
CREATE INDEX idx_ofertas_data ON public.ofertas_venda(created_at DESC);