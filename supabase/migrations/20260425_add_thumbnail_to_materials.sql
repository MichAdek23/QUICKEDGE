-- Migration: Add thumbnail_url to materials
-- Description: Supports the optional thumbnail upload feature for the Content Gallery

ALTER TABLE public.materials 
ADD COLUMN thumbnail_url text;
