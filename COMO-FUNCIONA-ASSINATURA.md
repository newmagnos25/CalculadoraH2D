# 🔐 Como Funciona o Sistema de Assinatura

## 🚨 PROBLEMA: Cartões de Teste Não Funcionam

**Por que está dando erro?**

O site no Vercel está usando as credenciais de **PRODUÇÃO**, não de TESTE!

Quando você configurou no Vercel, colocou:
- `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` = Produção
- `MERCADOPAGO_ACCESS_TOKEN` = Produção

**Cartões de teste** só funcionam com **credenciais de teste**.

---

## ✅ SOLUÇÃO RÁPIDA

### Opção 1: Testar com Cartões de TESTE (Recomendado)

1. Entre no Vercel: https://vercel.com/newmagnos25/calculadorah2-d
2. Vá em **Settings** → **Environment Variables**
3. Mude para as credenciais de **TEST**:
   ```
   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY = TEST-b218a451-a978-4171-a66e-9409f0a7b272
   MERCADOPAGO_ACCESS_TOKEN = TEST-8204722334915941-111517-5de9b5ddc61d81077701506aa100aab8-2493608388
   ```
4. Clique em **Save** e faça **Redeploy**
5. Agora os cartões de teste funcionam!

**Cartões de Teste que funcionam:**
```
✅ APROVADO:
Número: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: APRO

✅ PENDENTE:
Número: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: PEND

❌ REJEITADO:
Número: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: OTHE
```

### Opção 2: Usar Cartão REAL (Produção)

Se já está em produção, pode usar cartão real. Mas cuidado:
- Vai cobrar DE VERDADE
- Use um valor pequeno primeiro (Starter R$ 19,90)

---

## 🔄 Como o Sistema de Assinatura Funciona

### Fluxo Completo:

```
1. Usuário clica em "Assinar" → /pricing
   ↓
2. Escolhe plano (Starter/Pro/Enterprise/Lifetime)
   ↓
3. Vai para checkout → /checkout/[tier]
   ↓
4. Escolhe mensal/anual
   ↓
5. Clica em "Pagar com Mercado Pago"
   ↓
6. API cria preferência → /api/checkout
   ↓
7. Redireciona para Mercado Pago
   ↓
8. Usuário paga
   ↓
9. Mercado Pago notifica webhook → /api/webhooks/mercadopago
   ↓
10. Webhook salva no Supabase
   ↓
11. Sistema ativa assinatura
   ↓
12. Usuário volta para /checkout/success
```

---

## 🎯 Como o Sistema Sabe se a Pessoa Pagou?

### Quando o pagamento é aprovado:

**1. Webhook recebe notificação do MP:**
```javascript
// /api/webhooks/mercadopago
{
  "type": "payment",
  "data": {
    "id": "12345678"
  }
}
```

**2. Webhook busca detalhes do pagamento:**
```javascript
const payment = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
  headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
})
```

**3. Se aprovado, salva no Supabase:**
```sql
-- Tabela: subscriptions
INSERT INTO subscriptions (
  user_id,
  tier,
  status,
  current_period_start,
  current_period_end,
  payment_id
) VALUES (
  'user_123',
  'professional',
  'active',
  NOW(),
  NOW() + INTERVAL '1 month',
  '12345678'
);
```

**4. Sistema verifica assinatura:**
```javascript
// Sempre que o usuário usa a calculadora
const subscription = await supabase
  .from('subscriptions')
  .select('*')
  .eq('user_id', userId)
  .eq('status', 'active')
  .single()

if (!subscription) {
  // Não pagou ou expirou
  showUpgradeModal()
}

if (new Date() > new Date(subscription.current_period_end)) {
  // Assinatura expirou
  await supabase
    .from('subscriptions')
    .update({ status: 'expired' })
    .eq('id', subscription.id)

  showRenewModal()
}
```

---

## ⏰ Como Saber se o Mês Passou?

### Sistema de Verificação Automática:

**1. Ao Salvar Assinatura (Webhook):**
```javascript
const subscription = {
  user_id: 'user_123',
  tier: 'professional',
  status: 'active',
  current_period_start: new Date(), // Hoje
  current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
}
```

**2. Toda vez que o usuário entrar:**
```javascript
// middleware.ts ou useEffect no app
async function checkSubscription(userId) {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!sub) {
    return { access: 'free' } // Não tem assinatura
  }

  const now = new Date()
  const periodEnd = new Date(sub.current_period_end)

  if (now > periodEnd) {
    // Expirou!
    await supabase
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('id', sub.id)

    return { access: 'expired', tier: sub.tier }
  }

  return {
    access: 'active',
    tier: sub.tier,
    daysLeft: Math.ceil((periodEnd - now) / (24 * 60 * 60 * 1000))
  }
}
```

**3. Baseado nisso, libera ou bloqueia:**
```javascript
const access = await checkSubscription(userId)

if (access.tier === 'professional' && access.access === 'active') {
  // Pode gerar PDFs ilimitados ✅
  // Pode ver histórico ✅
  // Pode ver dashboard ✅
} else if (access.tier === 'starter' && access.access === 'active') {
  // Pode gerar até 50 PDFs/mês ✅
  // Sem histórico ❌
  // Sem dashboard ❌
} else {
  // Sem assinatura ou expirou
  // Só pode usar calculadora básica
  // PDFs com marca d'água "by BKreativeLab"
}
```

---

## 🔔 Sistema de Renovação

### Assinatura Mensal:

**Mercado Pago cobra automaticamente todo mês**
- No dia 15 de janeiro: Paga R$ 49,90
- No dia 15 de fevereiro: MP cobra novamente R$ 49,90
- Se o cartão falhar: MP notifica webhook → status = 'past_due'

**Webhook atualiza a data:**
```javascript
if (payment.status === 'approved') {
  await supabase
    .from('subscriptions')
    .update({
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active'
    })
    .eq('payment_id', payment.id)
}
```

### Assinatura Anual:

Mesma coisa, mas renova a cada 365 dias.

### Lifetime:

```javascript
{
  tier: 'lifetime',
  status: 'active',
  current_period_start: '2025-01-15',
  current_period_end: '2099-12-31', // Nunca expira
}
```

---

## 📊 Limites por Plano

### Como o Sistema Controla:

**1. Conta quantos orçamentos esse mês:**
```javascript
const { count } = await supabase
  .from('quotes_history')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId)
  .gte('created_at', startOfMonth)
  .lte('created_at', endOfMonth)

const subscription = await getSubscription(userId)

if (subscription.tier === 'starter' && count >= 50) {
  showUpgradeModal('Você atingiu o limite de 50 orçamentos esse mês. Faça upgrade!')
  return false
}

// Professional/Enterprise = ilimitado, pode continuar
```

**2. Conta quantos clientes:**
```javascript
const { count } = await supabase
  .from('clients')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId)

if (subscription.tier === 'starter' && count >= 20) {
  showUpgradeModal('Você atingiu o limite de 20 clientes. Faça upgrade!')
  return false
}
```

---

## 🎁 Trial de 7 Dias

### Como Funciona:

**1. Usuário clica em "Teste Grátis"**
```javascript
// Cria assinatura SEM pagamento
const subscription = {
  user_id: 'user_123',
  tier: 'professional',
  status: 'trialing', // Status especial
  trial_start: new Date(),
  trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 dias
  current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
}
```

**2. Durante o trial:**
```javascript
if (subscription.status === 'trialing') {
  const trialEnd = new Date(subscription.trial_end)
  const now = new Date()

  if (now < trialEnd) {
    // Ainda em trial, libera tudo ✅
    return { access: 'active', tier: 'professional', inTrial: true }
  } else {
    // Trial acabou
    await supabase
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('id', subscription.id)

    showUpgradeModal('Seu trial acabou! Assine agora para continuar.')
  }
}
```

**3. Quando converte (paga):**
```javascript
// Webhook recebe pagamento
await supabase
  .from('subscriptions')
  .update({
    status: 'active', // Não é mais trial
    payment_id: payment.id,
    current_period_start: new Date(),
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  })
  .eq('user_id', userId)
```

---

## 📝 Resumo do Fluxo:

| Ação | O que acontece |
|------|----------------|
| Usuário assina | Webhook salva no Supabase |
| Pagamento aprovado | `status = 'active'`, define `period_end` |
| Usuário entra no app | Verifica se `now < period_end` |
| Período expirou | `status = 'expired'`, mostra modal |
| MP renova (mensal) | Webhook atualiza `period_end` +30 dias |
| Limite atingido | Conta registros, bloqueia se passar |

---

## 🛠️ O Que Você Precisa Fazer AGORA:

### PASSO 1: Ativar modo TESTE

1. Vercel → Environment Variables
2. Usar credenciais TEST
3. Redeploy
4. Testar com cartões de teste

### PASSO 2: Ativar Supabase

1. Criar conta: https://supabase.com
2. Criar projeto
3. Rodar SQL: `supabase-setup.sql`
4. Adicionar no Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### PASSO 3: Implementar Verificação

Criar arquivo `/lib/subscription.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

export async function checkSubscription(userId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  if (!sub) return { access: 'free' }

  const now = new Date()
  const end = new Date(sub.current_period_end)

  if (now > end) {
    return { access: 'expired', tier: sub.tier }
  }

  return { access: 'active', tier: sub.tier }
}
```

### PASSO 4: Usar na Calculadora

```typescript
// components/Calculator.tsx
const access = await checkSubscription(userId)

if (access.tier === 'free') {
  // Marca d'água nos PDFs
  // Limite de 3 PDFs por mês
}
```

---

## 🔗 Links Úteis

- **Mercado Pago - Modo Teste:** https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test
- **Supabase Docs:** https://supabase.com/docs
- **Vercel Dashboard:** https://vercel.com/newmagnos25/calculadorah2-d

---

**PRONTO!** Agora você entende como funciona todo o sistema! 🎉

Qualquer dúvida, me chama!
