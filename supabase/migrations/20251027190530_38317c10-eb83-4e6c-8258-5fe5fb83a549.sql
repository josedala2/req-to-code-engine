-- Drop existing policy and create public read policy
DROP POLICY IF EXISTS "Usuários autenticados podem ver todos os lotes" ON public.lotes;

CREATE POLICY "Public can view lots"
ON public.lotes
FOR SELECT
USING (true);
