-- Permitir leitura pública de certificados de exportação emitidos
CREATE POLICY "Público pode visualizar certificados emitidos"
ON public.certificados_exportacao
FOR SELECT
USING (status = 'emitido');

-- Permitir leitura pública de análises de qualidade
CREATE POLICY "Público pode visualizar análises de qualidade"
ON public.qualidade
FOR SELECT
USING (true);

-- Comentário: Estas políticas permitem que qualquer pessoa acesse informações
-- através dos QR codes sem necessidade de autenticação, garantindo transparência
-- e rastreabilidade pública do café angolano.