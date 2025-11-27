-- Add completed column to activities table
ALTER TABLE public.activities 
ADD COLUMN completed BOOLEAN NOT NULL DEFAULT false;

-- Add index for faster queries on completed status
CREATE INDEX idx_activities_completed ON public.activities(completed);