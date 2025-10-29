-- Criar tabela de negociações
CREATE TABLE public.negociacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oferta_id UUID NOT NULL REFERENCES public.ofertas_venda(id) ON DELETE CASCADE,
  comprador_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vendedor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'aberta',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de mensagens de negociação
CREATE TABLE public.mensagens_negociacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negociacao_id UUID NOT NULL REFERENCES public.negociacoes(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mensagem TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.negociacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens_negociacao ENABLE ROW LEVEL SECURITY;

-- Políticas para negociações
CREATE POLICY "Usuários podem ver suas próprias negociações como comprador"
  ON public.negociacoes FOR SELECT
  USING (auth.uid() = comprador_id);

CREATE POLICY "Usuários podem ver suas próprias negociações como vendedor"
  ON public.negociacoes FOR SELECT
  USING (auth.uid() = vendedor_id);

CREATE POLICY "Admins podem ver todas negociações"
  ON public.negociacoes FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Usuários autenticados podem criar negociações"
  ON public.negociacoes FOR INSERT
  WITH CHECK (auth.uid() = comprador_id);

CREATE POLICY "Participantes podem atualizar negociações"
  ON public.negociacoes FOR UPDATE
  USING (auth.uid() = comprador_id OR auth.uid() = vendedor_id OR has_role(auth.uid(), 'admin'::app_role));

-- Políticas para mensagens
CREATE POLICY "Participantes podem ver mensagens de suas negociações"
  ON public.mensagens_negociacao FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.negociacoes
      WHERE negociacoes.id = mensagens_negociacao.negociacao_id
      AND (negociacoes.comprador_id = auth.uid() OR negociacoes.vendedor_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    )
  );

CREATE POLICY "Participantes podem enviar mensagens"
  ON public.mensagens_negociacao FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.negociacoes
      WHERE negociacoes.id = mensagens_negociacao.negociacao_id
      AND (negociacoes.comprador_id = auth.uid() OR negociacoes.vendedor_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    )
    AND auth.uid() = usuario_id
  );

-- Trigger para updated_at
CREATE TRIGGER update_negociacoes_updated_at
  BEFORE UPDATE ON public.negociacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_negociacoes_comprador ON public.negociacoes(comprador_id);
CREATE INDEX idx_negociacoes_vendedor ON public.negociacoes(vendedor_id);
CREATE INDEX idx_negociacoes_oferta ON public.negociacoes(oferta_id);
CREATE INDEX idx_mensagens_negociacao ON public.mensagens_negociacao(negociacao_id);