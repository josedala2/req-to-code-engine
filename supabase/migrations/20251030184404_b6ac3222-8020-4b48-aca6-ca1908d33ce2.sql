-- Adicionar campos para contraproposta do vendedor na tabela negociacoes
ALTER TABLE negociacoes 
ADD COLUMN IF NOT EXISTS valor_contraproposta_vendedor numeric,
ADD COLUMN IF NOT EXISTS observacoes_contraproposta_vendedor text,
ADD COLUMN IF NOT EXISTS contraproposta_vendedor_status text DEFAULT 'pendente';

COMMENT ON COLUMN negociacoes.valor_contraproposta_vendedor IS 'Valor da contraproposta feita pelo vendedor';
COMMENT ON COLUMN negociacoes.observacoes_contraproposta_vendedor IS 'Observações da contraproposta do vendedor';
COMMENT ON COLUMN negociacoes.contraproposta_vendedor_status IS 'Status da contraproposta: pendente, aceita, rejeitada';