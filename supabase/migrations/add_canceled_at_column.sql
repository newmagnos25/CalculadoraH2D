-- Migration: Add canceled_at column to subscriptions table
-- Created: 2025-11-18
-- Description: Adds canceled_at timestamp column to track when subscription was canceled

-- Add canceled_at column
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS canceled_at timestamp with time zone;

-- Add comment for documentation
COMMENT ON COLUMN public.subscriptions.canceled_at IS 'Timestamp when subscription was canceled by user';
