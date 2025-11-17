# 🧪 GUIA DE TESTE COMPLETO - Precifica3D PRO

## ✅ O QUE FOI IMPLEMENTADO

1. ✅ **Arredondamento inteligente** (23.26 → 25.00, 72.11 → 70.00)
2. ✅ **Tarifas atualizadas** (Nov/2024)
3. ✅ **Proteção de margem** (visitantes não veem lucro)
4. ✅ **Plano teste R$ 2,99** (7 dias de acesso)
5. ✅ **Tratamento de emails duplicados**
6. ✅ **Migration SQL** completa (inventário + segurança)

---

## 📋 CHECKLIST DE CONFIGURAÇÃO

### PASSO 1: Configurar Email no Supabase ✉️

1. **Acesse:** https://app.supabase.com/project/SEU_PROJECT_ID/auth/url-configuration

2. **Configure Site URL:**
   ```
   https://precifica3d.vercel.app
   ```
   (ou seu domínio real)

3. **Adicione Redirect URLs:**
   ```
   http://localhost:3000/**
   https://precifica3d.vercel.app/**
   ```

4. **Ative confirmação de email:**
   - Vá em: Authentication → Email Auth
   - Ative: "Enable email confirmations"

5. **Verifique Email Templates:**
   - Authentication → Email Templates
   - Confirme signup template usa: `{{ .ConfirmationURL }}`

---

### PASSO 2: Executar Migration SQL 🗄️

1. **Acesse:** https://app.supabase.com/project/SEU_PROJECT_ID/sql/new

2. **Copie o arquivo:**
   ```
   supabase/migrations/002_inventory_and_security.sql
   ```

3. **Cole no SQL Editor**

4. **Clique em RUN**

5. **Verifique se criou as tabelas:**
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN (
     'custom_filaments',
     'custom_addons',
     'custom_printers',
     'company_settings',
     'inventory_movements',
     'signup_attempts'
   );
   ```
   Deve retornar 6 tabelas ✅

---

### PASSO 3: Configurar Variáveis no Vercel 🚀

1. **Acesse:** https://vercel.com/SEU_PROJETO/settings/environment-variables

2. **Adicione:**
   ```bash
   NEXT_PUBLIC_SITE_URL=https://precifica3d.vercel.app
   ```

3. **Redeploy:**
   - Vá em Deployments
   - Clique nos 3 pontinhos do último deploy
   - Clique em "Redeploy"
   - Aguarde 2-3 minutos

---

### PASSO 4: Atualizar Schema do Supabase (Tier Test) 🔧

**Execute este SQL no Supabase:**

```sql
-- Adicionar tier 'test' ao enum
ALTER TYPE subscription_tier_enum ADD VALUE IF NOT EXISTS 'test';

-- OU se não existir o enum ainda, criar:
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier_enum') THEN
    CREATE TYPE subscription_tier_enum AS ENUM ('free', 'test', 'starter', 'professional', 'enterprise', 'lifetime');
  END IF;
END $$;

-- Atualizar check constraint da tabela subscriptions
ALTER TABLE subscriptions
DROP CONSTRAINT IF EXISTS subscriptions_tier_check;

ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_tier_check
CHECK (tier IN ('free', 'test', 'starter', 'professional', 'enterprise', 'lifetime'));
```

---

## 🧪 TESTE 1: Verificar Email de Confirmação

### Ações:
1. Abra: https://precifica3d.vercel.app/auth/signup
2. Crie uma conta com seu email real
3. Verifique a caixa de entrada

### Resultado Esperado:
- ✅ Email deve chegar em ~1 minuto
- ✅ Link deve ser: `https://precifica3d.vercel.app/auth/callback?token=...`
- ❌ NÃO deve ser: `http://localhost:3000/...`

### Se der errado:
- Verifique PASSO 1 novamente
- Confirme que redeploy foi feito (PASSO 3)

---

## 🧪 TESTE 2: Verificar Email Duplicado

### Ações:
1. Tente criar conta com o MESMO email do TESTE 1
2. Veja a mensagem de erro

### Resultado Esperado:
- ✅ Deve mostrar: "Este email já está cadastrado. Faça login ou use outro email."
- ❌ NÃO deve criar conta duplicada

---

## 🧪 TESTE 3: Verificar Proteção de Margem

### Ações:
1. Abra: https://precifica3d.vercel.app/ (SEM fazer login)
2. Vá em "Experimente Grátis"
3. Preencha os campos e clique em "Calcular Preço"

### Resultado Esperado:
- ✅ Deve mostrar custo base (sem margem de lucro)
- ✅ Deve mostrar aviso: "🔒 Cálculo Limitado - Faça Login"
- ✅ Botão "Fazer Login" deve aparecer

### Depois, faça login:
1. Faça login
2. Calcule novamente
3. Deve mostrar preço COM margem de lucro ✅

---

## 🧪 TESTE 4: Verificar Arredondamento

### Ações:
1. Faça login
2. Configure para gerar um orçamento que dê R$ 23,26
3. Clique em "Calcular Preço"

### Resultado Esperado:
- ✅ Deve arredondar para R$ 25,00

### Outros testes:
- R$ 72,11 → R$ 70,00 ✅
- R$ 78,21 → R$ 80,00 ✅
- R$ 47,80 → R$ 50,00 ✅

---

## 💳 TESTE 5: Plano Teste R$ 2,99 (PAGAMENTO REAL)

### Pré-requisitos:
- Mercado Pago configurado
- Webhook funcionando

### Ações:
1. Acesse: https://precifica3d.vercel.app/pricing
2. Clique em "Começar Teste por R$ 2,99"
3. Escolha método de pagamento:
   - **PIX** (recomendado para teste rápido)
   - Cartão de crédito
   - Boleto (demora 2 dias)

### Resultado Esperado:

**Se pagar com PIX:**
1. ✅ Gera QR Code
2. ✅ Você paga R$ 2,99
3. ✅ Em ~1 minuto webhook chega
4. ✅ Status muda para "approved"
5. ✅ Subscription vira "test" tier
6. ✅ Você é redirecionado para /checkout/success
7. ✅ Pode gerar 10 orçamentos
8. ✅ Tem acesso a histórico e dashboard

**Se pagar com Cartão:**
1. ✅ Aprovação imediata
2. ✅ Redirecionamento automático
3. ✅ Acesso liberado

---

## 🔍 TESTE 6: Verificar Limite de Orçamentos (Tier Test)

### Ações:
1. Após pagar R$ 2,99
2. Gere 10 orçamentos (limite do teste)
3. Tente gerar o 11º orçamento

### Resultado Esperado:
- ✅ Primeiros 10: geram normalmente
- ❌ 11º: bloqueia e mostra:
  - "Você atingiu o limite de 10 orçamentos"
  - Botão "Fazer Upgrade"

---

## 📊 VERIFICAÇÕES NO DASHBOARD SUPABASE

### Table Editor → subscriptions
```sql
SELECT user_id, tier, status, current_period_end
FROM subscriptions
WHERE tier = 'test'
LIMIT 10;
```

**Deve mostrar:**
- ✅ tier = 'test'
- ✅ status = 'active'
- ✅ current_period_end = +7 dias

---

### Table Editor → quotes
```sql
SELECT user_id, created_at, quote_data->'type' as doc_type
FROM quotes
WHERE user_id = 'SEU_USER_ID'
ORDER BY created_at DESC
LIMIT 10;
```

**Deve mostrar:**
- ✅ Orçamentos gerados
- ✅ Timestamp correto

---

## ⚠️ TROUBLESHOOTING

### Email não chega
1. Verificar spam/lixeira
2. Confirmar Site URL no Supabase
3. Redeploy no Vercel
4. Verificar logs: https://app.supabase.com/project/SEU_PROJECT_ID/logs/edge-logs

### Localhost no email
1. Adicionar NEXT_PUBLIC_SITE_URL no Vercel
2. Redeploy
3. Criar nova conta para testar

### Migration falha
1. Verificar se já existe alguma tabela com mesmo nome
2. Rodar: `DROP TABLE IF EXISTS nome_tabela CASCADE;`
3. Tentar migration novamente

### Plano teste não aparece
1. Verificar se adicionou tier 'test' ao enum
2. Executar SQL do PASSO 4
3. Limpar cache do navegador
4. Acessar /pricing de novo

### Pagamento não ativa assinatura
1. Verificar webhook no Mercado Pago
2. Ver logs: https://vercel.com/SEU_PROJETO/logs
3. Verificar se payment_id foi salvo
4. Executar manualmente:
   ```sql
   UPDATE subscriptions
   SET tier = 'test', status = 'active'
   WHERE user_id = 'SEU_USER_ID';
   ```

---

## ✅ CHECKLIST FINAL

- [ ] Email de confirmação funciona (não localhost)
- [ ] Email duplicado bloqueado
- [ ] Proteção de margem ativa
- [ ] Arredondamento funcionando
- [ ] Migration SQL executada
- [ ] Tier 'test' adicionado ao Supabase
- [ ] Plano teste R$ 2,99 aparece em /pricing
- [ ] Pagamento PIX R$ 2,99 funciona
- [ ] Webhook ativa subscription
- [ ] Limite de 10 orçamentos funciona

---

## 🎯 PRÓXIMOS PASSOS

### Se tudo funcionou:
1. ✅ Divulgar nas redes sociais
2. ✅ Fazer vídeo demo no YouTube/Instagram
3. ✅ Compartilhar em grupos de impressão 3D
4. ✅ Pedir feedback de amigos

### Se algo falhou:
1. Verificar logs no Vercel
2. Verificar logs no Supabase
3. Me chamar de volta para ajudar!

---

**🚀 BOA SORTE! Você está a poucos cliques de lançar o Precifica3D PRO ao mundo!**

---

**Data:** 17/11/2024
**Versão:** 1.0
**Status:** Pronto para teste
