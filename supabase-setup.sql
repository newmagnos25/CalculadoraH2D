-- ============================================
-- SUPABASE SETUP SQL - CalculadoraH2D
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================

-- 1. CRIAR TIPOS ENUM
CREATE TYPE subscription_tier AS ENUM ('starter', 'professional', 'enterprise', 'lifetime');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'expired');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- ============================================
-- 2. CRIAR TABELAS
-- ============================================

-- Tabela: profiles
-- Estende auth.users com dados adicionais do usuário
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: subscriptions
-- Armazena informações de assinatura/licença do usuário
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- Detalhes da assinatura
  tier subscription_tier NOT NULL DEFAULT 'starter',
  status subscription_status NOT NULL DEFAULT 'trialing',

  -- Informações de pagamento
  payment_method TEXT, -- 'mercado_pago', 'stripe', 'manual'
  payment_id TEXT, -- ID do pagamento externo

  -- Datas
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL,
  canceled_at TIMESTAMPTZ,

  -- Limites (baseado no tier)
  max_quotes INTEGER, -- NULL = ilimitado
  max_clients INTEGER, -- NULL = ilimitado
  max_companies INTEGER DEFAULT 1,

  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: usage_metrics
-- Rastreia uso para aplicar limites por tier
CREATE TABLE usage_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- Métricas do mês atual
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,

  quotes_generated INTEGER DEFAULT 0,
  clients_created INTEGER DEFAULT 0,
  companies_created INTEGER DEFAULT 0,

  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: quotes_history
-- Armazena orçamentos gerados para tiers professional+
CREATE TABLE quotes_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- Dados do orçamento (JSON)
  quote_data JSONB NOT NULL,

  -- Info do cliente
  client_name TEXT,
  client_id TEXT,

  -- Financeiro
  total_amount DECIMAL(10, 2),

  -- Metadados
  quote_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: payments
-- Rastreia transações de pagamento
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id),

  -- Detalhes do pagamento
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  status payment_status DEFAULT 'pending',

  -- Info de pagamento externo
  payment_method TEXT, -- 'mercado_pago', 'stripe', 'pix', 'boleto'
  external_id TEXT, -- ID do pagamento do gateway
  payment_url TEXT, -- URL para pagamento (boleto, PIX, etc.)

  -- Metadados
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CRIAR POLÍTICAS DE SEGURANÇA (RLS)
-- ============================================

-- Políticas: profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas: subscriptions
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Políticas: usage_metrics
CREATE POLICY "Users can view own metrics"
  ON usage_metrics FOR SELECT
  USING (auth.uid() = user_id);

-- Políticas: quotes_history
CREATE POLICY "Users can view own quotes"
  ON quotes_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quotes"
  ON quotes_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas: payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 5. CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_usage_metrics_user_id ON usage_metrics(user_id);
CREATE INDEX idx_usage_metrics_period ON usage_metrics(period_start, period_end);
CREATE INDEX idx_quotes_user_id ON quotes_history(user_id);
CREATE INDEX idx_quotes_created_at ON quotes_history(created_at DESC);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================
-- 6. CRIAR FUNÇÕES DO BANCO DE DADOS
-- ============================================

-- Função: Verificar acesso da assinatura
CREATE OR REPLACE FUNCTION check_subscription_access(user_id_param UUID)
RETURNS JSONB AS $$
DECLARE
  sub_record RECORD;
  usage_record RECORD;
  result JSONB;
BEGIN
  -- Buscar assinatura ativa
  SELECT * INTO sub_record
  FROM subscriptions
  WHERE user_id = user_id_param
    AND status IN ('active', 'trialing')
  ORDER BY created_at DESC
  LIMIT 1;

  -- Se não houver assinatura ativa, retornar limites do tier gratuito
  IF sub_record IS NULL THEN
    RETURN jsonb_build_object(
      'tier', 'free',
      'status', 'none',
      'max_quotes', 10,
      'max_clients', 5,
      'max_companies', 1,
      'has_history', false,
      'has_dashboard', false
    );
  END IF;

  -- Buscar uso atual
  SELECT * INTO usage_record
  FROM usage_metrics
  WHERE user_id = user_id_param
    AND period_start <= NOW()
    AND period_end >= NOW()
  ORDER BY created_at DESC
  LIMIT 1;

  -- Construir resultado
  result := jsonb_build_object(
    'tier', sub_record.tier,
    'status', sub_record.status,
    'max_quotes', sub_record.max_quotes,
    'max_clients', sub_record.max_clients,
    'max_companies', sub_record.max_companies,
    'current_quotes', COALESCE(usage_record.quotes_generated, 0),
    'current_clients', COALESCE(usage_record.clients_created, 0),
    'current_companies', COALESCE(usage_record.companies_created, 0),
    'has_history', sub_record.tier IN ('professional', 'enterprise', 'lifetime'),
    'has_dashboard', sub_record.tier IN ('professional', 'enterprise', 'lifetime'),
    'is_white_label', sub_record.tier IN ('enterprise', 'lifetime'),
    'period_end', sub_record.current_period_end
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função: Criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Criar perfil após registro
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 7. SEED DATA (OPCIONAL - PARA TESTES)
-- ============================================

-- Você pode descomentar isso para criar dados de teste:
-- INSERT INTO profiles (id, email, full_name, company_name)
-- VALUES (
--   auth.uid(),
--   'teste@exemplo.com',
--   'Usuário Teste',
--   'Empresa Teste'
-- );

-- ============================================
-- SETUP COMPLETO! ✅
-- ============================================
-- Agora você pode:
-- 1. Testar a autenticação
-- 2. Criar usuários
-- 3. Gerenciar assinaturas
-- ============================================
