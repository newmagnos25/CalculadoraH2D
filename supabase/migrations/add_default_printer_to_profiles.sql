-- Migration: Add default_printer_id to profiles
-- Created: 2025-11-18
-- Description: Allows users to save their preferred default printer

-- Add default_printer_id column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS default_printer_id text;

-- Add comment
COMMENT ON COLUMN public.profiles.default_printer_id IS 'ID of the user preferred default printer';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_default_printer_idx ON public.profiles(default_printer_id);
