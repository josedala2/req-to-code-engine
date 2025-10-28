-- Alterar o campo variedade em lotes para array
ALTER TABLE lotes 
ALTER COLUMN variedade TYPE text[] USING ARRAY[variedade];

-- Adicionar comentário documentando as opções
COMMENT ON COLUMN lotes.variedade IS 'Variedades de café: pode incluir Arabica, Robusta ou ambas';