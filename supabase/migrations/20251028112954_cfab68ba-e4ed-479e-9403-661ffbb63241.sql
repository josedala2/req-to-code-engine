-- Função para gerar código de auditoria automaticamente
CREATE OR REPLACE FUNCTION public.generate_auditoria_codigo()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  new_codigo TEXT;
  current_year TEXT;
BEGIN
  current_year := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  -- Buscar o último número usado no ano atual
  SELECT COALESCE(
    MAX(
      CAST(
        SUBSTRING(codigo FROM 'AUD-' || current_year || '-(\d+)')
        AS INTEGER
      )
    ),
    0
  ) INTO next_number
  FROM public.auditorias
  WHERE codigo LIKE 'AUD-' || current_year || '-%';
  
  -- Incrementar e formatar o código
  next_number := next_number + 1;
  new_codigo := 'AUD-' || current_year || '-' || LPAD(next_number::TEXT, 3, '0');
  
  RETURN new_codigo;
END;
$$;

-- Modificar a tabela para gerar código automaticamente se não fornecido
CREATE OR REPLACE FUNCTION public.set_auditoria_codigo()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.codigo IS NULL OR NEW.codigo = '' THEN
    NEW.codigo := public.generate_auditoria_codigo();
  END IF;
  RETURN NEW;
END;
$$;

-- Criar trigger para gerar código antes de inserir
DROP TRIGGER IF EXISTS trigger_set_auditoria_codigo ON public.auditorias;
CREATE TRIGGER trigger_set_auditoria_codigo
BEFORE INSERT ON public.auditorias
FOR EACH ROW
EXECUTE FUNCTION public.set_auditoria_codigo();