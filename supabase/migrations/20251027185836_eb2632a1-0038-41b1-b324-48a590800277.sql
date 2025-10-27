-- Criar tabela de lotes
CREATE TABLE public.lotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL UNIQUE,
  produtor_id uuid REFERENCES public.produtores(id) ON DELETE SET NULL,
  produtor_nome text NOT NULL,
  safra text NOT NULL,
  variedade text NOT NULL,
  processo text NOT NULL,
  data_colheita date NOT NULL,
  quantidade numeric NOT NULL,
  unidade text NOT NULL,
  peneira text,
  umidade numeric,
  observacoes text,
  certificacao text,
  status text DEFAULT 'ativo',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.lotes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários autenticados podem ver todos os lotes"
  ON public.lotes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins podem inserir lotes"
  ON public.lotes
  FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar lotes"
  ON public.lotes
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar lotes"
  ON public.lotes
  FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_lotes_updated_at
  BEFORE UPDATE ON public.lotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_lotes_codigo ON public.lotes(codigo);
CREATE INDEX idx_lotes_produtor_id ON public.lotes(produtor_id);
CREATE INDEX idx_lotes_safra ON public.lotes(safra);
