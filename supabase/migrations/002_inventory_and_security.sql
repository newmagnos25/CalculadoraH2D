-- ============================================
-- MIGRATION 002: Inventário e Segurança
-- Precifica3D PRO
-- ============================================

-- ============================================
-- 1. TABELAS DE INVENTÁRIO
-- ============================================

-- Tabela: custom_filaments
CREATE TABLE IF NOT EXISTS public.custom_filaments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,

  -- Dados do filamento
  brand TEXT NOT NULL,
  type TEXT NOT NULL,
  color TEXT,
  price_per_kg DECIMAL(10, 2) NOT NULL,

  -- Controle de estoque
  stock_quantity DECIMAL(10, 2) DEFAULT 0, -- em gramas
  stock_alert_threshold DECIMAL(10, 2) DEFAULT 500, -- alerta quando < 500g
  purchase_date TIMESTAMPTZ,
  supplier TEXT,

  -- Metadados
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS custom_filaments_user_id_idx ON public.custom_filaments(user_id);
CREATE INDEX IF NOT EXISTS custom_filaments_active_idx ON public.custom_filaments(user_id, is_active) WHERE is_active = true;

-- RLS
ALTER TABLE public.custom_filaments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own filaments" ON public.custom_filaments;
CREATE POLICY "Users can view own filaments"
  ON public.custom_filaments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own filaments" ON public.custom_filaments;
CREATE POLICY "Users can insert own filaments"
  ON public.custom_filaments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own filaments" ON public.custom_filaments;
CREATE POLICY "Users can update own filaments"
  ON public.custom_filaments FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own filaments" ON public.custom_filaments;
CREATE POLICY "Users can delete own filaments"
  ON public.custom_filaments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================

-- Tabela: custom_addons
CREATE TABLE IF NOT EXISTS public.custom_addons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,

  -- Dados do adereço
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price_per_unit DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL, -- 'un', 'kg', 'm', etc

  -- Controle de estoque
  stock_quantity INTEGER DEFAULT 0,
  stock_alert_threshold INTEGER DEFAULT 10,
  purchase_date TIMESTAMPTZ,
  supplier TEXT,

  -- Metadados
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS custom_addons_user_id_idx ON public.custom_addons(user_id);
CREATE INDEX IF NOT EXISTS custom_addons_active_idx ON public.custom_addons(user_id, is_active) WHERE is_active = true;

-- RLS
ALTER TABLE public.custom_addons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own addons" ON public.custom_addons;
CREATE POLICY "Users can view own addons"
  ON public.custom_addons FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own addons" ON public.custom_addons;
CREATE POLICY "Users can insert own addons"
  ON public.custom_addons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own addons" ON public.custom_addons;
CREATE POLICY "Users can update own addons"
  ON public.custom_addons FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own addons" ON public.custom_addons;
CREATE POLICY "Users can delete own addons"
  ON public.custom_addons FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================

-- Tabela: custom_printers
CREATE TABLE IF NOT EXISTS public.custom_printers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,

  -- Dados da impressora
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  power_consumption_watts INTEGER NOT NULL,
  build_volume_x INTEGER,
  build_volume_y INTEGER,
  build_volume_z INTEGER,

  -- Custo e manutenção
  purchase_price DECIMAL(10, 2),
  purchase_date TIMESTAMPTZ,
  depreciation_months INTEGER DEFAULT 36,

  -- Metadados
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS custom_printers_user_id_idx ON public.custom_printers(user_id);
CREATE INDEX IF NOT EXISTS custom_printers_active_idx ON public.custom_printers(user_id, is_active) WHERE is_active = true;

-- RLS
ALTER TABLE public.custom_printers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own printers" ON public.custom_printers;
CREATE POLICY "Users can view own printers"
  ON public.custom_printers FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own printers" ON public.custom_printers;
CREATE POLICY "Users can insert own printers"
  ON public.custom_printers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own printers" ON public.custom_printers;
CREATE POLICY "Users can update own printers"
  ON public.custom_printers FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own printers" ON public.custom_printers;
CREATE POLICY "Users can delete own printers"
  ON public.custom_printers FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================

-- Tabela: company_settings
CREATE TABLE IF NOT EXISTS public.company_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,

  -- Dados da empresa
  name TEXT NOT NULL,
  trade_name TEXT,
  cnpj TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,

  -- Configurações de documentos
  invoice_prefix TEXT DEFAULT 'INV-',
  invoice_counter INTEGER DEFAULT 1,
  payment_terms TEXT,
  bank_details TEXT,
  legal_notes TEXT,
  brand_color TEXT DEFAULT '#F97316',

  -- Metadados
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,

  UNIQUE(user_id)
);

-- RLS
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own company" ON public.company_settings;
CREATE POLICY "Users can view own company"
  ON public.company_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own company" ON public.company_settings;
CREATE POLICY "Users can insert own company"
  ON public.company_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own company" ON public.company_settings;
CREATE POLICY "Users can update own company"
  ON public.company_settings FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own company" ON public.company_settings;
CREATE POLICY "Users can delete own company"
  ON public.company_settings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================

-- Tabela: inventory_movements
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,

  -- Referência ao item
  item_type TEXT NOT NULL CHECK (item_type IN ('filament', 'addon')),
  item_id UUID NOT NULL,

  -- Movimento
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,

  -- Referência (opcional)
  quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,

  -- Observações
  notes TEXT,

  -- Metadados
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS inventory_movements_user_id_idx ON public.inventory_movements(user_id);
CREATE INDEX IF NOT EXISTS inventory_movements_item_idx ON public.inventory_movements(item_type, item_id);
CREATE INDEX IF NOT EXISTS inventory_movements_created_at_idx ON public.inventory_movements(created_at DESC);

-- RLS
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own movements" ON public.inventory_movements;
CREATE POLICY "Users can view own movements"
  ON public.inventory_movements FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own movements" ON public.inventory_movements;
CREATE POLICY "Users can insert own movements"
  ON public.inventory_movements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 2. PROTEÇÃO CONTRA ABUSO
-- ============================================

-- Tabela: signup_attempts
CREATE TABLE IF NOT EXISTS public.signup_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ip_address INET NOT NULL,
  email TEXT,
  device_fingerprint TEXT,
  success BOOLEAN DEFAULT false,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS signup_attempts_ip_idx ON public.signup_attempts(ip_address, created_at);
CREATE INDEX IF NOT EXISTS signup_attempts_email_idx ON public.signup_attempts(email, created_at);
CREATE INDEX IF NOT EXISTS signup_attempts_device_idx ON public.signup_attempts(device_fingerprint, created_at);

-- Não precisa RLS pois será acessado via função SECURITY DEFINER

-- ============================================
-- 3. FUNÇÕES AUXILIARES
-- ============================================

-- Função: Verificar rate limit de signup
CREATE OR REPLACE FUNCTION public.check_signup_rate_limit(
  p_ip_address INET,
  p_email TEXT DEFAULT NULL,
  p_device_fingerprint TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_ip_count INTEGER;
  v_email_count INTEGER;
  v_device_count INTEGER;
BEGIN
  -- Contar tentativas por IP nas últimas 24h
  SELECT COUNT(*)
  INTO v_ip_count
  FROM public.signup_attempts
  WHERE ip_address = p_ip_address
    AND created_at > now() - INTERVAL '24 hours';

  -- Contar tentativas por email nas últimas 24h
  IF p_email IS NOT NULL THEN
    SELECT COUNT(*)
    INTO v_email_count
    FROM public.signup_attempts
    WHERE email = p_email
      AND created_at > now() - INTERVAL '24 hours';
  ELSE
    v_email_count := 0;
  END IF;

  -- Contar tentativas por device nas últimas 24h
  IF p_device_fingerprint IS NOT NULL THEN
    SELECT COUNT(*)
    INTO v_device_count
    FROM public.signup_attempts
    WHERE device_fingerprint = p_device_fingerprint
      AND created_at > now() - INTERVAL '24 hours';
  ELSE
    v_device_count := 0;
  END IF;

  -- Verificar limites
  IF v_ip_count >= 3 THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'ip_limit',
      'message', 'Muitas tentativas de registro deste IP. Tente novamente em 24 horas.'
    );
  END IF;

  IF v_email_count >= 3 THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'email_limit',
      'message', 'Muitas tentativas com este email. Tente novamente em 24 horas.'
    );
  END IF;

  IF v_device_count >= 5 THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'device_limit',
      'message', 'Muitas tentativas de registro deste dispositivo. Tente novamente em 24 horas.'
    );
  END IF;

  RETURN jsonb_build_object(
    'allowed', true,
    'ip_count', v_ip_count,
    'email_count', v_email_count,
    'device_count', v_device_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================

-- Função: Registrar tentativa de signup
CREATE OR REPLACE FUNCTION public.register_signup_attempt(
  p_ip_address INET,
  p_email TEXT,
  p_device_fingerprint TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_success BOOLEAN DEFAULT false
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.signup_attempts (
    ip_address,
    email,
    device_fingerprint,
    user_agent,
    success
  )
  VALUES (
    p_ip_address,
    p_email,
    p_device_fingerprint,
    p_user_agent,
    p_success
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================

-- Função: Atualizar estoque ao gerar orçamento
CREATE OR REPLACE FUNCTION public.register_material_usage(
  p_user_id UUID,
  p_quote_id UUID,
  p_filament_usages JSONB,
  p_addon_usages JSONB
)
RETURNS VOID AS $$
BEGIN
  -- Registrar uso de filamentos
  IF p_filament_usages IS NOT NULL THEN
    INSERT INTO public.inventory_movements (user_id, item_type, item_id, movement_type, quantity, unit, quote_id)
    SELECT
      p_user_id,
      'filament',
      (usage->>'filament_id')::UUID,
      'out',
      (usage->>'weight')::DECIMAL,
      'g',
      p_quote_id
    FROM jsonb_array_elements(p_filament_usages) AS usage
    WHERE usage->>'filament_id' IS NOT NULL;

    -- Atualizar estoque de filamentos
    UPDATE public.custom_filaments cf
    SET stock_quantity = stock_quantity - (usage->>'weight')::DECIMAL,
        updated_at = now()
    FROM jsonb_array_elements(p_filament_usages) AS usage
    WHERE cf.id = (usage->>'filament_id')::UUID
      AND cf.user_id = p_user_id
      AND usage->>'filament_id' IS NOT NULL;
  END IF;

  -- Registrar uso de adereços
  IF p_addon_usages IS NOT NULL THEN
    INSERT INTO public.inventory_movements (user_id, item_type, item_id, movement_type, quantity, unit, quote_id)
    SELECT
      p_user_id,
      'addon',
      (usage->>'addon_id')::UUID,
      'out',
      (usage->>'quantity')::DECIMAL,
      'un',
      p_quote_id
    FROM jsonb_array_elements(p_addon_usages) AS usage
    WHERE usage->>'addon_id' IS NOT NULL;

    -- Atualizar estoque de adereços
    UPDATE public.custom_addons ca
    SET stock_quantity = stock_quantity - (usage->>'quantity')::INTEGER,
        updated_at = now()
    FROM jsonb_array_elements(p_addon_usages) AS usage
    WHERE ca.id = (usage->>'addon_id')::UUID
      AND ca.user_id = p_user_id
      AND usage->>'addon_id' IS NOT NULL;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================

-- Função: Obter itens com estoque baixo
CREATE OR REPLACE FUNCTION public.get_low_stock_items(p_user_id UUID)
RETURNS TABLE (
  item_type TEXT,
  item_id UUID,
  item_name TEXT,
  current_stock DECIMAL,
  threshold DECIMAL,
  unit TEXT
) AS $$
BEGIN
  RETURN QUERY
  -- Filamentos com estoque baixo
  SELECT
    'filament'::TEXT,
    id,
    brand || ' ' || type,
    stock_quantity,
    stock_alert_threshold,
    'g'::TEXT
  FROM public.custom_filaments
  WHERE user_id = p_user_id
    AND is_active = true
    AND stock_quantity <= stock_alert_threshold

  UNION ALL

  -- Adereços com estoque baixo
  SELECT
    'addon'::TEXT,
    id,
    name,
    stock_quantity::DECIMAL,
    stock_alert_threshold::DECIMAL,
    unit
  FROM public.custom_addons
  WHERE user_id = p_user_id
    AND is_active = true
    AND stock_quantity <= stock_alert_threshold

  ORDER BY current_stock ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. TRIGGERS
-- ============================================

-- Trigger para updated_at em custom_filaments
DROP TRIGGER IF EXISTS handle_updated_at ON public.custom_filaments;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.custom_filaments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger para updated_at em custom_addons
DROP TRIGGER IF EXISTS handle_updated_at ON public.custom_addons;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.custom_addons
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger para updated_at em custom_printers
DROP TRIGGER IF EXISTS handle_updated_at ON public.custom_printers;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.custom_printers
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger para updated_at em company_settings
DROP TRIGGER IF EXISTS handle_updated_at ON public.company_settings;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ============================================
-- FIM DA MIGRATION
-- ============================================
