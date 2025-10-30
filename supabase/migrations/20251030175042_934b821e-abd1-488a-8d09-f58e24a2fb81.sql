-- Adicionar política RLS para permitir que admins atualizem roles
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));