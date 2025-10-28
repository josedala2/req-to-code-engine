-- Adicionar campos para área de produção por variedade de café
ALTER TABLE produtores
ADD COLUMN IF NOT EXISTS area_arabica numeric,
ADD COLUMN IF NOT EXISTS area_robusta numeric;

-- Adicionar comentários para documentação
COMMENT ON COLUMN produtores.area_arabica IS 'Área de produção de café Arabica em hectares';
COMMENT ON COLUMN produtores.area_robusta IS 'Área de produção de café Robusta em hectares';