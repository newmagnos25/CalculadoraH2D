-- Migration: Create custom_printers table
-- Created: 2025-11-18
-- Description: Allows users to save their own custom printers in the database

-- Create custom_printers table
CREATE TABLE IF NOT EXISTS public.custom_printers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  printer_id text not null, -- ID único da impressora (gerado pelo app)
  name text not null,
  model text,
  power_consumption integer not null, -- Watts
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Garantir que cada usuário tenha printer_ids únicos
  unique(user_id, printer_id)
);

-- Enable RLS
ALTER TABLE public.custom_printers ENABLE ROW LEVEL SECURITY;

-- Policies: usuários só podem ver/modificar suas próprias impressoras
DROP POLICY IF EXISTS "Usuários podem ver suas próprias impressoras" ON public.custom_printers;
CREATE POLICY "Usuários podem ver suas próprias impressoras"
  ON public.custom_printers FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem criar suas próprias impressoras" ON public.custom_printers;
CREATE POLICY "Usuários podem criar suas próprias impressoras"
  ON public.custom_printers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias impressoras" ON public.custom_printers;
CREATE POLICY "Usuários podem atualizar suas próprias impressoras"
  ON public.custom_printers FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar suas próprias impressoras" ON public.custom_printers;
CREATE POLICY "Usuários podem deletar suas próprias impressoras"
  ON public.custom_printers FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS custom_printers_user_id_idx ON public.custom_printers(user_id);
CREATE INDEX IF NOT EXISTS custom_printers_printer_id_idx ON public.custom_printers(printer_id);

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_custom_printers_updated_at ON public.custom_printers;
CREATE TRIGGER update_custom_printers_updated_at
  BEFORE UPDATE ON public.custom_printers
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Comentários
COMMENT ON TABLE public.custom_printers IS 'Custom 3D printers created by users';
COMMENT ON COLUMN public.custom_printers.printer_id IS 'Unique printer identifier (app-generated)';
COMMENT ON COLUMN public.custom_printers.power_consumption IS 'Power consumption in Watts';
