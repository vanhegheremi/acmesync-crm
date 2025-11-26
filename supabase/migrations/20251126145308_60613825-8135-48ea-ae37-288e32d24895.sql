-- Ajouter les champs origin et temperature à la table leads
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS origin text,
ADD COLUMN IF NOT EXISTS temperature text;