# URLs para Configurar no Supabase - Precifica3D

## ⚠️ IMPORTANTE: Configure essas URLs no painel do Supabase

Acesse: https://supabase.com/dashboard/project/SEU_PROJETO_ID/auth/url-configuration

---

## 1. Site URL (URL Principal)

Cole exatamente isto:

```
https://precifica3d.vercel.app
```

---

## 2. Redirect URLs (URLs de Redirecionamento)

**Copie e cole TODAS estas URLs** (uma por linha no campo):

```
https://precifica3d.vercel.app/auth/callback
https://precifica3d.vercel.app/auth/reset-password
https://precifica3d.vercel.app/*
http://localhost:3000/auth/callback
http://localhost:3000/auth/reset-password
http://localhost:3000/*
```

**Como adicionar:**
1. Clique em "Add URL"
2. Cole a URL
3. Clique em "Add"
4. Repita para cada URL acima

---

## 3. Variável de Ambiente no Vercel

Acesse: https://vercel.com/seu-time/precifica3d/settings/environment-variables

**Adicione esta variável:**

```
Nome: NEXT_PUBLIC_APP_URL
Valor: https://precifica3d.vercel.app
```

**IMPORTANTE:** Depois de adicionar, faça **Redeploy** da aplicação!

---

## Funcionalidades que agora funcionam:

✅ **Confirmação de Email**
- Links vêm com domínio correto (não mais localhost)
- Redirecionam para /auth/callback

✅ **Recuperação de Senha**
- Email de "esqueci minha senha"
- Redirecionam para /auth/reset-password
- Permite criar nova senha

✅ **Reenvio de Confirmação**
- Botão para reenviar email expirado
- Feedback visual colorido (vermelho=erro, amarelo=alerta, verde=sucesso)

---

## Verificação Rápida:

1. ✅ Configurou Site URL no Supabase?
2. ✅ Adicionou TODAS as 6 Redirect URLs?
3. ✅ Configurou NEXT_PUBLIC_APP_URL no Vercel?
4. ✅ Fez Redeploy no Vercel?

Se todos estiverem ✅, o email deve funcionar perfeitamente!

---

## Cores das Mensagens (Nova Feature):

🔴 **VERMELHO** = Erros reais (senha errada, falha de conexão)
🟡 **AMARELO** = Avisos/Alertas (verifique seu email, email enviado)
🟢 **VERDE** = Sucesso (operação concluída)

---

## Botão "Esqueci minha senha":

- Aparece ao lado do campo "Senha" no login
- Digite seu email
- Clique em "Esqueci minha senha"
- Receba email com link para redefinir
- Crie nova senha
- Pronto!
