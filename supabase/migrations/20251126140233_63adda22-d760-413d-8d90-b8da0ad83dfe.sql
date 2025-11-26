-- Fix security warnings for functions by setting search_path

-- Recreate update_updated_at_column function with search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate update_lead_last_contact function with search_path
CREATE OR REPLACE FUNCTION public.update_lead_last_contact()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.leads
  SET last_contact_date = NEW.date
  WHERE id = NEW.lead_id;
  RETURN NEW;
END;
$$;