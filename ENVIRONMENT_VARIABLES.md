# 🔐 Variáveis de Ambiente Obrigatórias

Este documento lista TODAS as variáveis de ambiente necessárias para o Precifica3D funcionar corretamente.

## ⚠️ IMPORTANTE

Se você apagou as variáveis de ambiente do Vercel, adicione APENAS as listadas abaixo. **NÃO** adicione as antigas terminadas em "s" (SUPABASEs_..., etc).

---

## 📋 Lista Completa

### 1. **SUPABASE** (Autenticação e Banco de Dados)

```bash
# URL pública do seu projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://jcfqcyayzphcniwsembk.supabase.co

# Chave pública (anon key) - pode ser exposta no front-end
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZnFjeWF5enBoY25pd3NlbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNjY0NTgsImV4cCI6MjA3ODg0MjQ1OH0.tQlN9x_L7d7v9iKcXqLQJUYSYiJXz2_1mMC1Y9I6gFY

# Chave de serviço (service role) - NUNCA exponha no front-end!
# Usada pelos webhooks e APIs server-side
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZnFjeWF5enBoY25pd3NlbWJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzI2NjQ1OCwiZXhwIjoyMDc4ODQyNDU4fQ.qlRoevFBhiR_VtmxZPUtmETxlJBQWFJmkJ3ABR1yDGc
```

**Onde encontrar:**
- Acesse: https://supabase.com/dashboard
- Selecione seu projeto
- Vá em **Settings** → **API**
- Copie `Project URL` e as chaves

---

### 2. **MERCADO PAGO** (Pagamentos)

```bash
# Access Token (servidor) - NUNCA exponha no front-end!
MERCADOPAGO_ACCESS_TOKEN=APP_USR-8204722334915941-111517-5c3a0188c2c6c50bde93787ee48a8948-2493608388

# Public Key (cliente) - pode ser exposta no front-end
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-e74f5fbf-f25a-426e-b607-aac7b262e3e1
```

**Onde encontrar:**
- Acesse: https://www.mercadopago.com.br/developers/panel
- Vá em **Suas aplicações** → Selecione sua aplicação
- Copie as credenciais de **Produção** (NÃO use as de teste!)

---

### 3. **ADMIN** (Ativação Manual de Planos)

```bash
# Senha secreta para usar o endpoint /api/admin/activate-subscription
ADMIN_SECRET=admin-secret-2024
```

**Nota:** Você pode mudar para uma senha mais segura se quiser.

---

### 4. **SITE URL** (Webhooks e Redirecionamentos)

```bash
# URL pública do seu site na Vercel
NEXT_PUBLIC_SITE_URL=https://precifica3d.vercel.app

# Alternativa (se a anterior não funcionar):
NEXT_PUBLIC_APP_URL=https://precifica3d.vercel.app
```

**Importante:** Use a URL da Vercel, **NÃO** use `localhost` ou `127.0.0.1`!

---

## ✅ Como Adicionar no Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **CalculadoraH2D** (ou Precifica3D)
3. Vá em **Settings** → **Environment Variables**
4. Clique em **Add New**
5. Cole cada variável (nome e valor)
6. Selecione **Production**, **Preview** e **Development**
7. Clique em **Save**
8. **Redeploy** o projeto após adicionar todas

---

## ❌ Variáveis que PODEM SER DELETADAS

Se você ainda tem essas no Vercel, PODE APAGAR:

```bash
SUPABASEs_URL          # Antiga (com "s" no final)
SUPABASEs_ANON_KEY     # Antiga (com "s" no final)
SUPABASEs_SERVICE_KEY  # Antiga (com "s" no final)
```

---

## 🧪 Como Testar se Está Funcionando

Após adicionar as variáveis e fazer redeploy:

1. **Teste de Autenticação:**
   - Acesse: https://precifica3d.vercel.app/auth/login
   - Tente fazer login
   - ✅ Se funcionar = Supabase OK

2. **Teste de Checkout:**
   - Acesse: https://precifica3d.vercel.app/pricing
   - Clique em um plano
   - ✅ Se redirecionar para Mercado Pago = Mercado Pago OK

3. **Teste de Webhook:**
   - Faça um pagamento de teste via PIX (R$ 2,90)
   - Aguarde 5-10 minutos
   - ✅ Se o plano ativar automaticamente = Webhook OK

---

## 🆘 Problemas Comuns

### Erro: "MERCADOPAGO_ACCESS_TOKEN não configurado"
**Solução:** Adicione a variável `MERCADOPAGO_ACCESS_TOKEN` e redeploy

### Erro: "SUPABASE_SERVICE_ROLE_KEY undefined"
**Solução:** Adicione a variável `SUPABASE_SERVICE_ROLE_KEY` e redeploy

### Pagamento não ativa plano automaticamente
**Solução:**
1. Verifique se o webhook está configurado no Mercado Pago
2. URL do webhook deve ser: `https://precifica3d.vercel.app/api/webhooks/mercadopago`
3. Certifique-se que `SUPABASE_SERVICE_ROLE_KEY` está configurada

---

## 📞 Precisa de Ajuda?

Se após configurar tudo corretamente ainda houver problemas:

1. Verifique os logs no Vercel: https://vercel.com/dashboard → Projeto → **Logs**
2. Verifique os logs do Supabase: https://supabase.com/dashboard → Projeto → **Logs**
3. Entre em contato: suporte@precifica3d.com

---

**Última atualização:** 2025-11-17
