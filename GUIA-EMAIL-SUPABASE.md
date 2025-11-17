# 📧 Guia: Configurar Email no Supabase

## 🚨 Problema: Email Não Chega

Se o email de confirmação não está chegando, pode ser por 3 motivos:

1. ⚠️ **Confirmação está desabilitada** (mais provável)
2. 📧 **SMTP não configurado** (Supabase usa servidor próprio)
3. 🗑️ **Email caiu no spam**

---

## ✅ Solução 1: Verificar Se Confirmação Está Ativa

### Passo 1: Abrir Dashboard do Supabase

1. Acesse: https://supabase.com/dashboard
2. Faça login
3. Selecione seu projeto **CalculadoraH2D** (ou Precifica3D)

### Passo 2: Verificar Configuração de Email

1. No menu lateral → **Authentication**
2. Clique em **Providers**
3. Procure por **Email** na lista
4. Clique para expandir

### Passo 3: Verificar "Confirm email"

Você vai ver uma opção: **"Confirm email"**

#### Se estiver DESMARCADO (OFF):
```
✅ ISSO É BOM! Não precisa confirmar email.
→ Usuários são criados instantaneamente
→ Sem problemas de email não chegar
```

#### Se estiver MARCADO (ON):
```
⚠️ Precisa confirmar email
→ Usuário precisa clicar no link
→ Se email não chegar = não consegue usar
```

---

## 🔧 Opção A: Desabilitar Confirmação (RECOMENDADO)

### Quando Usar:
- Durante desenvolvimento
- Para testes
- Se não tem domínio próprio configurado
- Se emails não estão chegando

### Como Fazer:

1. **Authentication** → **Providers** → **Email**
2. **Desmarque** a opção "Confirm email"
3. Clique em **Save**
4. **Pronto!** Novos usuários não precisam confirmar

### Vantagens:
- ✅ Zero fricção no cadastro
- ✅ Usuário usa imediatamente
- ✅ Não perde clientes por problema de email

### Desvantagens:
- ⚠️ Pessoas podem criar contas com emails falsos
- ⚠️ Menos seguro (mas ok para testes)

---

## 🔧 Opção B: Configurar SMTP Próprio (AVANÇADO)

### Quando Usar:
- Em produção
- Com domínio próprio
- Precisa de alta taxa de entrega

### Serviços Recomendados:

| Serviço | Preço | Emails/Mês | Recomendação |
|---------|-------|------------|--------------|
| **SendGrid** | Grátis | 100/dia | ⭐ Melhor para começar |
| **Mailgun** | Grátis | 5.000 | ⭐⭐ Muito confiável |
| **Resend** | Grátis | 3.000 | ⭐⭐⭐ Fácil de usar |
| **AWS SES** | Pago | Ilimitado | ⚡ Mais barato em escala |

### Como Configurar (SendGrid):

#### 1. Criar Conta no SendGrid
- Acesse: https://sendgrid.com
- Crie conta grátis

#### 2. Criar API Key
- Dashboard → **Settings** → **API Keys**
- **Create API Key**
- Nome: `Supabase Email`
- Permissões: **Full Access** ou **Mail Send**
- Copie a key (só aparece uma vez!)

#### 3. Verificar Domínio
- **Settings** → **Sender Authentication**
- **Authenticate Your Domain**
- Siga os passos (adicionar DNS records)

#### 4. Configurar no Supabase
- Dashboard do Supabase → **Project Settings**
- **Authentication** → **Email**
- Role até **SMTP Settings**

Preencha:
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [SUA_API_KEY_AQUI]
Sender Email: noreply@seudominio.com
Sender Name: Precifica3D
```

#### 5. Testar
- Crie uma conta de teste
- Veja se email chega

---

## 🔧 Opção C: Usar Email Templates Customizados

### Como Editar Templates:

1. **Authentication** → **Email Templates**
2. Você verá 4 templates:
   - **Confirm signup** ← Email de confirmação
   - **Invite user**
   - **Magic Link**
   - **Change Email Address**
   - **Reset Password**

3. Clique em **Confirm signup**

4. Personalize o HTML:
```html
<h2>Confirme seu email - Precifica3D</h2>
<p>Olá!</p>
<p>Clique no botão abaixo para confirmar seu email e começar a usar:</p>
<a href="{{ .ConfirmationURL }}" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
  Confirmar Email
</a>
<p>Ou copie e cole este link no seu navegador:</p>
<p>{{ .ConfirmationURL }}</p>
```

5. Clique em **Save**

---

## 📧 Checklist de Problemas Comuns

### Email não chega:

- [ ] Verificar se confirmação está ativada no Supabase
- [ ] Checar pasta de SPAM/Lixeira
- [ ] Testar com outro email (Gmail, Outlook)
- [ ] Ver logs no Supabase (Authentication → Logs)
- [ ] Verificar se domínio está na blacklist (https://mxtoolbox.com)

### Email chega mas link não funciona:

- [ ] Verificar se `NEXT_PUBLIC_APP_URL` está correto no Vercel
- [ ] Testar se callback route existe: `/auth/callback`
- [ ] Ver erros no console do navegador (F12)
- [ ] Verificar se link não expirou (padrão: 1 hora)

---

## 🎯 Recomendação Para Você

### Para DESENVOLVIMENTO/TESTES:
```
✅ DESABILITAR confirmação de email
→ Authentication → Providers → Email → Desmarcar "Confirm email"
```

### Para PRODUÇÃO (depois):
```
✅ Configurar SendGrid ou Resend
→ Melhor taxa de entrega
→ Emails profissionais
→ Templates personalizados
```

---

## 🆘 Se Nada Funcionar

### Debug no Supabase:

1. **Authentication** → **Users**
2. Encontre o usuário teste
3. Veja coluna `email_confirmed_at`
   - Se `NULL` = não confirmou
   - Se tem data = já confirmou

4. **Authentication** → **Logs**
   - Procure por erros de email
   - Veja se email foi enviado

### Forçar Confirmação Manual:

Use o endpoint admin que criamos:
```bash
curl -X POST https://precifica3d.vercel.app/api/admin/confirm-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-secret-2024" \
  -d '{
    "email": "usuario@email.com"
  }'
```

(Precisamos criar esse endpoint se ainda não existe)

---

## 📚 Links Úteis

- SendGrid: https://sendgrid.com
- Resend: https://resend.com
- Mailgun: https://www.mailgun.com
- Supabase Docs - SMTP: https://supabase.com/docs/guides/auth/auth-smtp

---

**Última atualização:** 2025-11-17
**Status:** ✅ Guia completo
