# 🗄️ DATABASE SCHEMA - CalculadoraH2D PRO

## 📋 **SUPABASE SETUP GUIDE**

### **Step 1: Create Supabase Project**
1. Go to https://supabase.com
2. Create a new project
3. Copy your Project URL and anon/public API key
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 📊 **DATABASE TABLES**

### **1. profiles**
Extends Supabase auth.users with additional user data

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

---

### **2. subscriptions**
Stores user subscription/license information

```sql
CREATE TYPE subscription_tier AS ENUM ('starter', 'professional', 'enterprise', 'lifetime');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'expired');

CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- Subscription details
  tier subscription_tier NOT NULL DEFAULT 'starter',
  status subscription_status NOT NULL DEFAULT 'trialing',

  -- Payment info
  payment_method TEXT, -- 'mercado_pago', 'stripe', 'manual'
  payment_id TEXT, -- External payment ID

  -- Dates
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL,
  canceled_at TIMESTAMPTZ,

  -- Limits (based on tier)
  max_quotes INTEGER, -- NULL = unlimited
  max_clients INTEGER, -- NULL = unlimited
  max_companies INTEGER DEFAULT 1,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

---

### **3. usage_metrics**
Tracks usage for enforcing tier limits

```sql
CREATE TABLE usage_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- Current month metrics
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,

  quotes_generated INTEGER DEFAULT 0,
  clients_created INTEGER DEFAULT 0,
  companies_created INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own metrics"
  ON usage_metrics FOR SELECT
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_usage_metrics_user_id ON usage_metrics(user_id);
CREATE INDEX idx_usage_metrics_period ON usage_metrics(period_start, period_end);
```

---

### **4. quotes_history** (FUTURE)
Stores generated quotes for professional+ tiers

```sql
CREATE TABLE quotes_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- Quote data (JSON)
  quote_data JSONB NOT NULL,

  -- Client info
  client_name TEXT,
  client_id TEXT,

  -- Financial
  total_amount DECIMAL(10, 2),

  -- Metadata
  quote_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE quotes_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own quotes"
  ON quotes_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quotes"
  ON quotes_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_quotes_user_id ON quotes_history(user_id);
CREATE INDEX idx_quotes_created_at ON quotes_history(created_at DESC);
```

---

### **5. payments**
Tracks payment transactions

```sql
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id),

  -- Payment details
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  status payment_status DEFAULT 'pending',

  -- External payment info
  payment_method TEXT, -- 'mercado_pago', 'stripe', 'pix', 'boleto'
  external_id TEXT, -- Payment ID from gateway
  payment_url TEXT, -- URL for payment (boleto, PIX, etc.)

  -- Metadata
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);
```

---

## 🔧 **DATABASE FUNCTIONS**

### **Function: Check Subscription Access**
```sql
CREATE OR REPLACE FUNCTION check_subscription_access(user_id_param UUID)
RETURNS JSONB AS $$
DECLARE
  sub_record RECORD;
  usage_record RECORD;
  result JSONB;
BEGIN
  -- Get active subscription
  SELECT * INTO sub_record
  FROM subscriptions
  WHERE user_id = user_id_param
    AND status IN ('active', 'trialing')
  ORDER BY created_at DESC
  LIMIT 1;

  -- If no active subscription, return free tier limits
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

  -- Get current usage
  SELECT * INTO usage_record
  FROM usage_metrics
  WHERE user_id = user_id_param
    AND period_start <= NOW()
    AND period_end >= NOW()
  ORDER BY created_at DESC
  LIMIT 1;

  -- Build result
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
```

---

## 📝 **EXAMPLE QUERIES**

### **Get user's active subscription**
```sql
SELECT
  s.*,
  u.quotes_generated,
  u.clients_created
FROM subscriptions s
LEFT JOIN usage_metrics u ON s.user_id = u.user_id
WHERE s.user_id = auth.uid()
  AND s.status IN ('active', 'trialing')
ORDER BY s.created_at DESC
LIMIT 1;
```

### **Check if user can generate quote**
```sql
SELECT check_subscription_access(auth.uid());
```

---

## 🚀 **SETUP CHECKLIST**

- [ ] Create Supabase project
- [ ] Run all CREATE TABLE statements
- [ ] Run all RLS policies
- [ ] Run database functions
- [ ] Test authentication flow
- [ ] Test subscription checks
- [ ] Configure email templates
- [ ] Setup webhooks for payment gateway

---

## 🔐 **SECURITY NOTES**

1. **Row Level Security (RLS)** is enabled on all tables
2. Users can only access their own data
3. Service role key should ONLY be used server-side
4. Never expose service role key in client code
5. All sensitive operations should use server-side functions

---

## 📊 **TIER LIMITS**

| Tier | Quotes/Month | Clients | Companies | History | Dashboard | White-Label |
|------|--------------|---------|-----------|---------|-----------|-------------|
| Starter | 30 | 10 | 1 | ❌ | ❌ | ❌ |
| Professional | ∞ | ∞ | 3 | ✅ | ✅ | ❌ |
| Enterprise | ∞ | ∞ | ∞ | ✅ | ✅ | ✅ |
| Lifetime | ∞ | ∞ | ∞ | ✅ | ✅ | ✅ |
