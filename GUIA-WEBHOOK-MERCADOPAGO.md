# 🔔 Guia Completo: Configurar Webhook/IPN do Mercado Pago

Este guia explica como configurar corretamente o sistema de notificações do Mercado Pago para ativar planos automaticamente após pagamento.

---

## 🎯 O Problema

Quando um usuário paga via PIX/Cartão/Boleto:
- ✅ O pagamento é aprovado no Mercado Pago
- ❌ O Mercado Pago NÃO notifica seu site
- ❌ O plano do usuário não é ativado automaticamente
- 😡 Usuário fica frustrado esperando

**Causa:** Webhook/IPN não configurado ou configurado incorretamente.

---

## 🔧 Solução: Configurar IPN (Instant Payment Notification)

O Mercado Pago tem **2 sistemas de notificação:**

1. **Webhooks** (novo) - Fica na seção "Webhooks"
2. **IPN** (legado) - Fica em "Detalhes da aplicação"

### ⚠️ Você PRECISA configurar o **IPN**, não o Webhooks!

---

## 📋 Passo a Passo Completo

### 1️⃣ Acessar o Painel do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Faça login com sua conta
3. Vá em **"Suas aplicações"**
4. Clique na sua aplicação (ou crie uma se não tiver)

---

### 2️⃣ Configurar IPN (URL de Notificação)

1. Na página da aplicação, role até **"Notificações"**
2. Procure por **"URL de notificação de pagamento instantâneo (IPN)"**
3. Cole esta URL EXATA:

```
https://precifica3d.vercel.app/api/webhooks/mercadopago
```

4. Clique em **"Salvar"**

---

### 3️⃣ Configurar Modo Produção

1. Na mesma página, procure por **"Modo de operação"**
2. Certifique-se que está em **"Produção"** (NÃO "Teste")
3. Se estiver em teste, clique em **"Ativar credenciais de produção"**

---

### 4️⃣ Verificar Eventos Habilitados

1. Role até **"Eventos a serem notificados"**
2. Certifique-se que **"payment"** (pagamento) está MARCADO
3. Salve as alterações

---

### 5️⃣ Copiar Credenciais de Produção

1. Na mesma página, procure por **"Credenciais de produção"**
2. Copie:
   - **Access Token** (começa com `APP_USR-...`)
   - **Public Key** (começa com `APP_USR-...`)
3. Cole no Vercel (Environment Variables):
   - `MERCADOPAGO_ACCESS_TOKEN` = Access Token
   - `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` = Public Key

---

## ✅ Verificar se Está Funcionando

### Teste 1: URL de Notificação Salva

1. Volte em https://www.mercadopago.com.br/developers/panel
2. Clique na sua aplicação
3. Verifique se a URL `https://precifica3d.vercel.app/api/webhooks/mercadopago` está salva

### Teste 2: Fazer Pagamento de Teste

1. Acesse: https://precifica3d.vercel.app/pricing
2. Escolha o plano **TEST** (R$ 2,90)
3. Pague com PIX
4. Aguarde até 10 minutos
5. ✅ Se o plano ativar automaticamente = **Webhook OK!**
6. ❌ Se não ativar = Continue para troubleshooting

---

## 🐛 Troubleshooting (Resolução de Problemas)

### Problema 1: "Webhook returning 502"

**Causa:** Variáveis de ambiente faltando no Vercel

**Solução:**
1. Acesse Vercel: https://vercel.com/dashboard
2. Vá em Settings → Environment Variables
3. Verifique se TODAS essas variáveis existem:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   MERCADOPAGO_ACCESS_TOKEN
   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
   ```
4. Se alguma estiver faltando, adicione (veja `ENVIRONMENT_VARIABLES.md`)
5. **Redeploy** o projeto

---

### Problema 2: "Webhook não está sendo chamado"

**Causa:** IPN não configurado corretamente

**Solução:**
1. Verifique se configurou o **IPN**, não o Webhooks
2. URL deve ser EXATAMENTE: `https://precifica3d.vercel.app/api/webhooks/mercadopago`
3. Certifique-se que salvou as alterações
4. Aguarde 5 minutos para as mudanças propagarem

---

### Problema 3: "Pagamento aprovado mas plano não ativa"

**Causa:** Webhook está sendo chamado mas falhando

**Solução:**
1. Acesse Vercel Logs: https://vercel.com/dashboard → Projeto → **Logs**
2. Procure por erros após fazer um pagamento
3. Procure por:
   - `🚀 [WEBHOOK] Início do processamento`
   - `❌ [WEBHOOK] Variáveis de ambiente faltando`
   - `✅ Assinatura ativada com sucesso`
4. Corrija os erros encontrados

---

### Problema 4: "PIX demora muito para aprovar"

**Causa:** PIX é instantâneo, mas o webhook pode demorar

**Solução:**
1. PIX normalmente aprova em **segundos**
2. Webhook deve processar em **até 5 minutos**
3. Se demorar mais de 10 minutos:
   - Verifique logs do Vercel
   - Verifique se IPN está configurado
   - Ative manualmente usando `/api/admin/activate-subscription`

---

## 🔍 Como Ver se o Webhook Foi Chamado

### Opção 1: Logs do Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto
3. Vá em **Logs** (menu lateral)
4. Faça um pagamento de teste
5. Aguarde 1-2 minutos
6. Procure por `[WEBHOOK]` nos logs
7. Se aparecer = Webhook está sendo chamado ✅
8. Se NÃO aparecer = IPN não configurado ❌

### Opção 2: Logs do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Clique na aplicação
3. Vá em **"Notificações"** ou **"Histórico"**
4. Veja tentativas de envio do webhook
5. Status 200 = Sucesso ✅
6. Status 502/500 = Erro no servidor ❌

---

## 🆘 Ativação Manual (Emergência)

Se o webhook não funcionar, você pode ativar planos manualmente:

### Via Console do Navegador

1. Abra https://precifica3d.vercel.app
2. Pressione **F12** (abrir DevTools)
3. Vá na aba **Console**
4. Cole e execute:

```javascript
fetch('https://precifica3d.vercel.app/api/admin/activate-subscription', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer admin-secret-2024'
  },
  body: JSON.stringify({
    user_email: 'email@do-usuario.com',
    tier: 'test',
    days: 7
  })
})
.then(r => r.json())
.then(d => console.log(d));
```

**Substitua:**
- `email@do-usuario.com` → Email do usuário que pagou
- `tier: 'test'` → Plano pago (`'test'`, `'starter'`, `'professional'`, etc.)
- `days: 7` → Dias do plano (7 para test, 30 para mensal, 365 para anual)

---

## 📝 Checklist Final

Antes de fazer um pagamento de teste real, verifique:

- [ ] IPN configurado com URL: `https://precifica3d.vercel.app/api/webhooks/mercadopago`
- [ ] Modo de operação: **Produção** (não Teste)
- [ ] Eventos habilitados: **payment** marcado
- [ ] Variáveis de ambiente no Vercel: TODAS configuradas (veja `ENVIRONMENT_VARIABLES.md`)
- [ ] Redeploy feito após adicionar variáveis
- [ ] Migration SQL rodada no Supabase (arquivo `supabase/migrations/add_expiration_to_check_quote_limit.sql`)

---

## 🎉 Tudo Funcionando!

Quando tudo estiver configurado:

1. Usuário faz pagamento via PIX
2. Mercado Pago aprova em segundos
3. Mercado Pago chama o webhook em `https://precifica3d.vercel.app/api/webhooks/mercadopago`
4. Webhook ativa o plano automaticamente
5. Usuário recarrega a página e vê plano ativo ✅

**Tempo total:** 1-5 minutos (PIX) | 5-10 minutos (Cartão)

---

## 📞 Precisa de Ajuda?

Se após seguir este guia ainda houver problemas:

1. Verifique os logs do Vercel
2. Verifique os logs do Supabase
3. Entre em contato: suporte@precifica3d.com
4. Inclua: prints da configuração do IPN + logs do Vercel + ID do pagamento

---

**Última atualização:** 2025-11-17
