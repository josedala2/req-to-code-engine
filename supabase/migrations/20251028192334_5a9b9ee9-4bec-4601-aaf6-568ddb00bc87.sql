-- Atualizar variedades de café dos produtores existentes para apenas Arabica ou Robusta
-- Substitui Bourbon, Catuaí, Mundo Novo por Arabica (que é a categoria geral)

UPDATE produtores 
SET variedades = ARRAY['Arabica']::text[]
WHERE variedades IS NOT NULL 
  AND (
    'Bourbon' = ANY(variedades) OR
    'Catuaí' = ANY(variedades) OR
    'Mundo Novo' = ANY(variedades) OR
    'bourbon' = ANY(variedades) OR
    'catuai' = ANY(variedades)
  );