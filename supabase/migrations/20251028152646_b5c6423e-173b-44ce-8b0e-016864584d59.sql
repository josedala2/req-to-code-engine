-- Add document fields to produtores table
ALTER TABLE public.produtores
ADD COLUMN documento_bi TEXT,
ADD COLUMN fotografia TEXT,
ADD COLUMN documento_posse_terra TEXT;

-- Create storage bucket for producer documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('producer-documents', 'producer-documents', false);

-- RLS policies for producer documents bucket
CREATE POLICY "Anyone can upload producer documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'producer-documents');

CREATE POLICY "Anyone can view producer documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'producer-documents');

CREATE POLICY "Admins can delete producer documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'producer-documents' AND has_role(auth.uid(), 'admin'::app_role));