-- Create leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('tryon', 'himyt')),
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  segment TEXT,
  status TEXT NOT NULL,
  notes TEXT,
  last_contact_date TIMESTAMPTZ,
  next_action_date TIMESTAMPTZ,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  type TEXT NOT NULL CHECK (type IN ('email', 'call', 'linkedin', 'demo', 'other')),
  content TEXT NOT NULL,
  done_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create policies for leads (allow all operations for now, can be restricted later)
CREATE POLICY "Allow all operations on leads" ON public.leads
  FOR ALL USING (true) WITH CHECK (true);

-- Create policies for activities
CREATE POLICY "Allow all operations on activities" ON public.activities
  FOR ALL USING (true) WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for leads
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to update last_contact_date when activity is added
CREATE OR REPLACE FUNCTION public.update_lead_last_contact()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.leads
  SET last_contact_date = NEW.date
  WHERE id = NEW.lead_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_last_contact_trigger
AFTER INSERT ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.update_lead_last_contact();

-- Create indexes for better performance
CREATE INDEX idx_leads_type ON public.leads(type);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_next_action_date ON public.leads(next_action_date);
CREATE INDEX idx_leads_last_contact_date ON public.leads(last_contact_date);
CREATE INDEX idx_activities_lead_id ON public.activities(lead_id);
CREATE INDEX idx_activities_date ON public.activities(date);