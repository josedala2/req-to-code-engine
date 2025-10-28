-- Create table for coffee quality analysis
CREATE TABLE public.qualidade (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lote_id UUID REFERENCES public.lotes(id),
  data_analise DATE NOT NULL,
  classificador_nome TEXT NOT NULL,
  classificador_certificacao TEXT,
  
  -- Sensory attributes (0-10 scale)
  fragrancia NUMERIC(3,1) CHECK (fragrancia >= 0 AND fragrancia <= 10),
  sabor NUMERIC(3,1) CHECK (sabor >= 0 AND sabor <= 10),
  pos_gosto NUMERIC(3,1) CHECK (pos_gosto >= 0 AND pos_gosto <= 10),
  acidez NUMERIC(3,1) CHECK (acidez >= 0 AND acidez <= 10),
  corpo NUMERIC(3,1) CHECK (corpo >= 0 AND corpo <= 10),
  equilibrio NUMERIC(3,1) CHECK (equilibrio >= 0 AND equilibrio <= 10),
  uniformidade NUMERIC(3,1) CHECK (uniformidade >= 0 AND uniformidade <= 10),
  xicara_limpa NUMERIC(3,1) CHECK (xicara_limpa >= 0 AND xicara_limpa <= 10),
  doçura NUMERIC(3,1) CHECK (doçura >= 0 AND doçura <= 10),
  
  -- Final score
  nota_final NUMERIC(4,1),
  
  -- Defects and analysis
  defeitos INTEGER DEFAULT 0,
  umidade NUMERIC(4,2),
  classificacao TEXT,
  descritores TEXT[],
  recomendacoes TEXT,
  observacoes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.qualidade ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins podem visualizar todas análises"
  ON public.qualidade FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem inserir análises"
  ON public.qualidade FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar análises"
  ON public.qualidade FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar análises"
  ON public.qualidade FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_qualidade_updated_at
  BEFORE UPDATE ON public.qualidade
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();