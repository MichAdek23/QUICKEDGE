-- Add is_published column to materials table, defaulting to false for new drafts
ALTER TABLE public.materials ADD COLUMN is_published BOOLEAN DEFAULT false;

-- Update all existing materials to be published so they don't disappear from users
UPDATE public.materials SET is_published = true;
