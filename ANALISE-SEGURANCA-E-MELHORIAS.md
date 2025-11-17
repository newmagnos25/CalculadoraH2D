# 🔒 Análise de Segurança e Melhorias - Precifica3D PRO

## ⚠️ PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. 🚨 **DADOS NO LOCALSTORAGE (CRÍTICO)**

**Problema Atual:**
```typescript
// ❌ TODOS os dados estão no localStorage:
- Filamentos customizados
- Adereços customizados
- Impressoras customizadas
- Clientes
- Configurações da empresa
- Orçamentos
```

**Consequências:**
- ❌ **ZERO isolamento entre usuários**: Se 2 pessoas usarem o mesmo computador, veem os dados um do outro
- ❌ **Perda de dados**: Limpar cache = perder tudo
- ❌ **Sem backup**: Não há como recuperar dados
- ❌ **Sem sincronização**: Cada dispositivo tem dados diferentes
- ❌ **Sem auditoria**: Impossível rastrear quem criou/editou o quê
- ❌ **Vulnerabilidade**: Fácil manipular dados no console do navegador

**Impacto:** 🔴 **ALTO - Risco de perda de dados e violação de privacidade**

---

### 2. 🚨 **ABUSO DE CONTAS GRATUITAS (CRÍTICO)**

**Problema Atual:**
- Pessoa cria conta → ganha 3 orçamentos grátis
- Cria outra conta com outro email → mais 3 grátis
- Repete infinitamente ❌

**Não há:**
- ❌ Verificação de email obrigatória
- ❌ CAPTCHA no registro
- ❌ Limite por IP
- ❌ Device fingerprinting
- ❌ Rate limiting no registro

**Impacto:** 🔴 **ALTO - Perda de receita e sobrecarga do sistema**

---

### 3. ⚠️ **GESTÃO DE INVENTÁRIO INEXISTENTE**

**Falta:**
- ❌ Página dedicada para gerenciar filamentos
- ❌ Controle de estoque (quantidade em estoque)
- ❌ Histórico de uso de materiais
- ❌ Alertas de estoque baixo
- ❌ Custo total em estoque
- ❌ Relatórios de uso por cliente/projeto

**Impacto:** 🟡 **MÉDIO - Experiência inferior para empresas profissionais**

---

### 4. ⚠️ **CONCORRÊNCIA E RACE CONDITIONS**

**Problema Potencial:**
- Múltiplos usuários gerando orçamentos simultaneamente
- Contador de invoices pode duplicar
- Verificação de limites pode ter race condition

**Impacto:** 🟡 **MÉDIO - Pode causar bugs em produção**

---

## ✅ SOLUÇÕES PROPOSTAS

### FASE 1: MIGRAÇÃO PARA SUPABASE (PRIORIDADE MÁXIMA)

#### 1.1 Criar Tabelas Faltantes

```sql
-- Tabela: custom_filaments
CREATE TABLE custom_filaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Dados do filamento
  brand TEXT NOT NULL,
  type TEXT NOT NULL,
  color TEXT,
  price_per_kg DECIMAL(10, 2) NOT NULL,

  -- Controle de estoque
  stock_quantity DECIMAL(10, 2) DEFAULT 0, -- em gramas
  stock_alert_threshold DECIMAL(10, 2) DEFAULT 500, -- alerta quando < 500g

  -- Metadados
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: custom_addons
CREATE TABLE custom_addons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Dados do adereço
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price_per_unit DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL, -- 'un', 'kg', 'm', etc

  -- Controle de estoque
  stock_quantity INTEGER DEFAULT 0,
  stock_alert_threshold INTEGER DEFAULT 10,

  -- Metadados
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: custom_printers
CREATE TABLE custom_printers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Dados da impressora
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  power_consumption_watts INTEGER NOT NULL,
  build_volume_x INTEGER,
  build_volume_y INTEGER,
  build_volume_z INTEGER,

  -- Metadados
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: company_settings
CREATE TABLE company_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id) -- Uma empresa por usuário (pode ser expandido depois)
);

-- Tabela: inventory_movements (para rastrear uso de materiais)
CREATE TABLE inventory_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Referência ao item
  item_type TEXT NOT NULL, -- 'filament', 'addon'
  item_id UUID NOT NULL,

  -- Movimento
  movement_type TEXT NOT NULL, -- 'in' (entrada), 'out' (saída), 'adjustment'
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,

  -- Referência (opcional)
  quote_id UUID REFERENCES quotes(id),

  -- Observações
  notes TEXT,

  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 1.2 Habilitar RLS

```sql
-- RLS para custom_filaments
ALTER TABLE custom_filaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own filaments"
  ON custom_filaments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own filaments"
  ON custom_filaments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own filaments"
  ON custom_filaments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own filaments"
  ON custom_filaments FOR DELETE
  USING (auth.uid() = user_id);

-- Repetir para custom_addons, custom_printers, company_settings, inventory_movements
```

#### 1.3 Criar Funções para Controle de Estoque

```sql
-- Função: Registrar uso de material ao gerar orçamento
CREATE OR REPLACE FUNCTION register_material_usage(
  p_user_id UUID,
  p_quote_id UUID,
  p_filament_usages JSONB,
  p_addon_usages JSONB
)
RETURNS VOID AS $$
BEGIN
  -- Registrar uso de filamentos
  INSERT INTO inventory_movements (user_id, item_type, item_id, movement_type, quantity, unit, quote_id)
  SELECT
    p_user_id,
    'filament',
    (usage->>'filament_id')::UUID,
    'out',
    (usage->>'weight')::DECIMAL,
    'g',
    p_quote_id
  FROM jsonb_array_elements(p_filament_usages) AS usage;

  -- Atualizar estoque de filamentos
  UPDATE custom_filaments cf
  SET stock_quantity = stock_quantity - (usage->>'weight')::DECIMAL
  FROM jsonb_array_elements(p_filament_usages) AS usage
  WHERE cf.id = (usage->>'filament_id')::UUID
    AND cf.user_id = p_user_id;

  -- Registrar uso de adereços
  INSERT INTO inventory_movements (user_id, item_type, item_id, movement_type, quantity, unit, quote_id)
  SELECT
    p_user_id,
    'addon',
    (usage->>'addon_id')::UUID,
    'out',
    (usage->>'quantity')::DECIMAL,
    'un',
    p_quote_id
  FROM jsonb_array_elements(p_addon_usages) AS usage;

  -- Atualizar estoque de adereços
  UPDATE custom_addons ca
  SET stock_quantity = stock_quantity - (usage->>'quantity')::INTEGER
  FROM jsonb_array_elements(p_addon_usages) AS usage
  WHERE ca.id = (usage->>'addon_id')::UUID
    AND ca.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### FASE 2: PROTEÇÃO CONTRA ABUSO

#### 2.1 Verificação de Email Obrigatória

```typescript
// No Supabase Dashboard -> Authentication -> Email Auth Settings
// Ativar: "Confirm email"
```

#### 2.2 Implementar CAPTCHA (Google reCAPTCHA v3)

```bash
npm install react-google-recaptcha-v3
```

```typescript
// app/auth/signup/page.tsx
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const { executeRecaptcha } = useGoogleReCaptcha();

const handleSignup = async () => {
  if (!executeRecaptcha) return;

  const token = await executeRecaptcha('signup');

  // Enviar token para backend verificar
  const verified = await verifyRecaptcha(token);

  if (!verified) {
    setError('Verificação de segurança falhou');
    return;
  }

  // Continuar com signup...
};
```

#### 2.3 Rate Limiting por IP

```sql
-- Tabela: signup_attempts
CREATE TABLE signup_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  email TEXT,
  success BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para performance
CREATE INDEX idx_signup_attempts_ip ON signup_attempts(ip_address, created_at);

-- Função: Verificar limite de tentativas
CREATE OR REPLACE FUNCTION check_signup_rate_limit(p_ip_address INET)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Contar tentativas nas últimas 24 horas
  SELECT COUNT(*)
  INTO v_count
  FROM signup_attempts
  WHERE ip_address = p_ip_address
    AND created_at > NOW() - INTERVAL '24 hours';

  -- Permitir máximo 3 contas por IP por dia
  RETURN v_count < 3;
END;
$$ LANGUAGE plpgsql;
```

#### 2.4 Device Fingerprinting

```bash
npm install @fingerprintjs/fingerprintjs
```

```typescript
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const fp = await FingerprintJS.load();
const result = await fp.get();
const deviceId = result.visitorId;

// Salvar no signup
```

---

### FASE 3: PÁGINA DE GESTÃO DE INVENTÁRIO

Criar página completa: `/app/inventory/page.tsx`

**Features:**
- ✅ Listagem de todos os materiais (filamentos + adereços)
- ✅ Controle de estoque em tempo real
- ✅ Alertas de estoque baixo
- ✅ Adicionar/Editar/Remover items
- ✅ Entrada/Saída de estoque
- ✅ Histórico de movimentações
- ✅ Valor total do estoque
- ✅ Custo por projeto/cliente
- ✅ Relatórios e gráficos

---

### FASE 4: MELHORIAS DE PERFORMANCE

#### 4.1 Usar Transações Atômicas

```typescript
// Gerar orçamento com controle transacional
const { data, error } = await supabase.rpc('generate_quote_transaction', {
  p_user_id: user.id,
  p_quote_data: quoteData,
  p_filament_usages: filamentUsages,
  p_addon_usages: addonUsages
});
```

#### 4.2 Cache Inteligente

```typescript
// Usar SWR ou React Query para cache
import useSWR from 'swr';

const { data: filaments } = useSWR('/api/filaments', fetcher, {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 60000 // 1 minuto
});
```

---

## 📋 PLANO DE IMPLEMENTAÇÃO

### Sprint 1 (Crítico - 3 dias)
1. ✅ Criar tabelas no Supabase
2. ✅ Migrar dados do localStorage → Supabase
3. ✅ Implementar RLS completo
4. ✅ Testar isolamento de dados

### Sprint 2 (Urgente - 2 dias)
1. ✅ Implementar verificação de email
2. ✅ Adicionar CAPTCHA
3. ✅ Rate limiting por IP
4. ✅ Device fingerprinting

### Sprint 3 (Importante - 5 dias)
1. ✅ Criar página de inventário
2. ✅ Controle de estoque
3. ✅ Histórico de movimentações
4. ✅ Relatórios e dashboards

### Sprint 4 (Melhorias - 3 dias)
1. ✅ Otimizações de performance
2. ✅ Cache inteligente
3. ✅ Testes de carga
4. ✅ Monitoramento

---

## 🎯 IMPACTO ESPERADO

### Após Implementação:
- ✅ **100% de isolamento** entre usuários
- ✅ **Zero perda de dados** - tudo no banco
- ✅ **Sincronização** automática entre dispositivos
- ✅ **Redução de 80%** no abuso de contas gratuitas
- ✅ **Experiência profissional** para empresas
- ✅ **Escalabilidade** para milhares de usuários

---

## 💰 RETORNO SOBRE INVESTIMENTO

**Antes:**
- ❌ Empresas não confiam (risco de perder dados)
- ❌ Muitos usuários free abusando
- ❌ Sem controle de estoque = feature faltando

**Depois:**
- ✅ **Confiança empresarial** → mais conversões para planos pagos
- ✅ **Menos abuso** → economia de infraestrutura
- ✅ **Feature profissional** → diferencial competitivo

**Estimativa:**
- Conversão free → paid: +40%
- Redução de abuso: -70%
- Churn: -30%

---

## ⚠️ ATENÇÃO

**NÃO implementar essas mudanças:**
1. ❌ Não remover plano free (é isca para conversão)
2. ❌ Não exigir cartão para trial (barreira alta)
3. ❌ Não limitar demais (frustra usuários legítimos)

**FAZER:**
1. ✅ Manter plano free com 3 orçamentos
2. ✅ Adicionar friccção inteligente (CAPTCHA, email)
3. ✅ Monitorar padrões de abuso
4. ✅ Banir IPs/devices suspeitos

---

## 🚀 PRÓXIMOS PASSOS

1. **APROVAÇÃO**: Revisar este documento
2. **PRIORIZAÇÃO**: Decidir ordem de implementação
3. **DESENVOLVIMENTO**: Implementar Sprint 1 primeiro
4. **TESTES**: QA completo antes de produção
5. **DEPLOY**: Migração gradual com rollback plan

---

**Criado em:** 2025-11-17
**Versão:** 1.0
**Status:** Aguardando aprovação
