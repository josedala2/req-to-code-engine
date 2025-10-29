-- Adicionar campos para contra-proposta na tabela negociacoes
ALTER TABLE public.negociacoes
ADD COLUMN valor_proposto numeric,
ADD COLUMN metodo_pagamento text,
ADD COLUMN observacoes_proposta text,
ADD COLUMN proposta_status text DEFAULT 'pendente' CHECK (proposta_status IN ('pendente', 'aceita', 'rejeitada', 'nova_proposta'));

-- Comentários para documentação
COMMENT ON COLUMN public.negociacoes.valor_proposto IS 'Valor proposto pelo comprador na contra-proposta';
COMMENT ON COLUMN public.negociacoes.metodo_pagamento IS 'Método de pagamento proposto (ex: transferência, boleto, etc)';
COMMENT ON COLUMN public.negociacoes.observacoes_proposta IS 'Observações adicionais sobre a proposta';
COMMENT ON COLUMN public.negociacoes.proposta_status IS 'Status da proposta: pendente, aceita, rejeitada, nova_proposta';