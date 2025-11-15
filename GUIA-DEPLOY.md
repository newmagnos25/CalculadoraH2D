# 🚀 Guia Completo de Deploy - CalculadoraH2D PRO

## 📋 Checklist de Deploy

Antes de fazer deploy, certifique-se de ter configurado:

- [x] ✅ Supabase (banco de dados e autenticação)
- [x] ✅ Mercado Pago (pagamentos)
- [ ] ⏳ Vercel (hospedagem)
- [ ] ⏳ Variáveis de ambiente no Vercel

---

## Passo 1: Configurar Branch no Vercel

### Opção A: Configurar Vercel para Deploy da Branch Correta (RECOMENDADO)

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **calculadora-h2d**
3. Vá em **Settings** > **Git**
4. Em **Production Branch**, mude de `main` para:
   ```
   claude/chat-access-inquiry-011B4BgpS7reUKRhqp5HSLaC
   ```
5. Clique em **Save**
6. Vá em **Deployments** e clique em **Redeploy**

### Opção B: Criar Pull Request no GitHub

Se preferir manter `main` como branch de produção:

1. Acesse: https://github.com/newmagnos25/CalculadoraH2D
2. Vá em **Pull Requests** > **New Pull Request**
3. Base: `main` ← Compare: `claude/chat-access-inquiry-011B4BgpS7reUKRhqp5HSLaC`
4. Clique em **Create Pull Request**
5. Revise as mudanças e clique em **Merge Pull Request**
6. O Vercel vai fazer deploy automaticamente

---

## Passo 2: Configurar Variáveis de Ambiente no Vercel

1. No dashboard do Vercel, vá em **Settings** > **Environment Variables**
2. Adicione as seguintes variáveis:

### Supabase (OBRIGATÓRIO)

```env
NEXT_PUBLIC_SUPABASE_URL=https://yjadhjdegaxunmgckapn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqYWRoamRlZ2F4dW5tZ2NrYXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMjY5NDgsImV4cCI6MjA3ODgwMjk0OH0.OhnE5akO5gy2_yL0a9NzuBZIIiTau-Uf_Qy-2yotZ7M
```

### Mercado Pago (OBRIGATÓRIO para pagamentos)

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-seu-token-aqui
```
(Use TEST-token para desenvolvimento, depois troque para APP_USR-token em produção)

### URL da Aplicação (OBRIGATÓRIO)

```env
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```
(Troque por sua URL real do Vercel)

3. Para cada variável:
   - Cole o **Nome** (ex: `NEXT_PUBLIC_SUPABASE_URL`)
   - Cole o **Valor**
   - Selecione **Production**, **Preview** e **Development**
   - Clique em **Add**

4. Depois de adicionar todas, clique em **Redeploy** para aplicar

---

## Passo 3: Testar o Deploy

1. Aguarde o deploy terminar (~2-3 minutos)
2. Acesse a URL do seu projeto (ex: `https://calculadora-h2d.vercel.app`)
3. Teste as funcionalidades principais:
   - ✅ Calculadora funciona
   - ✅ Configurações salvam
   - ✅ Geração de PDF funciona
   - ✅ Página de preços carrega
   - ✅ Checkout abre e redireciona para Mercado Pago

---

## Passo 4: Configurar Webhook do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers
2. Vá em **Webhooks** > **Configurar Webhooks**
3. Cole a URL:
   ```
   https://seu-dominio.vercel.app/api/webhooks/mercadopago
   ```
4. Selecione os eventos:
   - ✅ payment
   - ✅ plan
   - ✅ subscription
5. Clique em **Salvar**

---

## Passo 5: Atualizar URL de Callback do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto **CalculadoraH2D**
3. Vá em **Authentication** > **URL Configuration**
4. Adicione em **Redirect URLs**:
   ```
   https://seu-dominio.vercel.app/**
   ```
5. Em **Site URL**, coloque:
   ```
   https://seu-dominio.vercel.app
   ```
6. Clique em **Save**

---

## Passo 6: Testar Pagamento

### Modo Teste (primeiro teste assim):

1. Acesse: `https://seu-dominio.vercel.app/pricing`
2. Clique em **Testar 14 Dias Grátis** (plano Professional)
3. Escolha **Mensal** ou **Anual**
4. Clique em **Ir para Pagamento**
5. No Mercado Pago, use cartão de teste:
   ```
   Número: 5031 4332 1540 6351
   CVV: 123
   Validade: 11/25
   Nome: APRO
   ```
6. Você deve ser redirecionado para `/checkout/success`

### Modo Produção (quando estiver pronto):

1. No Vercel, vá em **Settings** > **Environment Variables**
2. Edite `MERCADOPAGO_ACCESS_TOKEN`
3. Troque de `TEST-...` para `APP_USR-...` (seu token de produção)
4. Faça **Redeploy**
5. Agora os pagamentos serão reais!

---

## 🔥 Checklist Final de Deploy

Antes de anunciar o site:

- [ ] ✅ Site está no ar (URL funcionando)
- [ ] ✅ Supabase configurado e conectado
- [ ] ✅ Mercado Pago configurado (modo produção)
- [ ] ✅ Webhook do Mercado Pago configurado
- [ ] ✅ URL de callback do Supabase atualizada
- [ ] ✅ Teste de pagamento realizado
- [ ] ✅ Email de confirmação chegando
- [ ] ✅ Domínio personalizado configurado (opcional)

---

## 🆘 Problemas Comuns

### Erro 500 ao gerar PDF

**Causa:** Falta de memória no Vercel (plano gratuito tem limite)
**Solução:** Upgrade para plano Pro ou otimizar imagens

### Pagamento não confirma

**Causa:** Webhook não configurado
**Solução:** Verifique se a URL do webhook está correta

### Autenticação não funciona

**Causa:** Redirect URLs não configuradas
**Solução:** Adicione `https://seu-dominio.vercel.app/**` no Supabase

### Build falha no Vercel

**Causa:** Erro de TypeScript ou dependência faltando
**Solução:** Rode `npm run build` localmente para encontrar o erro

---

## 📧 Suporte

Se precisar de ajuda:

1. Verifique os logs do Vercel: **Deployments** > Clique no deploy > **Function Logs**
2. Verifique os logs do Supabase: **Logs** no menu lateral
3. Entre em contato: suporte@calculadorah2d.com

---

## 🎉 Pronto!

Seu CalculadoraH2D PRO está no ar! 🚀

Próximos passos:
1. Configure um domínio personalizado (opcional)
2. Divulgue nas redes sociais
3. Monitore os primeiros usuários
