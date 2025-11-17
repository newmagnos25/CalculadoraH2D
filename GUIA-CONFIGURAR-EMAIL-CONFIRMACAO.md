# 🔧 GUIA: Configurar URLs de Confirmação no Supabase

## PROBLEMA: Email de confirmação vem com localhost:3000

### SOLUÇÃO RÁPIDA:

1. **Acesse o Supabase Dashboard:**
   ```
   https://app.supabase.com/project/SEU_PROJECT_ID/auth/url-configuration
   ```

2. **Configure as URLs:**

   **Site URL:**
   ```
   https://SEU-DOMINIO.vercel.app
   ```
   ou
   ```
   https://precifica3d.com.br
   ```

   **Redirect URLs (adicione AMBAS):**
   ```
   http://localhost:3000/**
   https://SEU-DOMINIO.vercel.app/**
   ```

3. **Email Templates:**
   - Vá em: Authentication → Email Templates
   - Edite o template "Confirm signup"
   - Verifique se usa: `{{ .ConfirmationURL }}`

4. **IMPORTANTE - Variáveis de Ambiente:**

   No seu `.env.local` E no Vercel:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://SEU-DOMINIO.vercel.app
   ```

5. **Atualizar Código (se necessário):**

   Arquivo: `app/auth/signup/page.tsx`
   ```typescript
   const { data, error } = await supabase.auth.signUp({
     email,
     password,
     options: {
       data: { full_name: fullName },
       // ADICIONE ISSO:
       emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
     },
   });
   ```

6. **Redeploy no Vercel:**
   - Adicione a variável NEXT_PUBLIC_SITE_URL
   - Faça redeploy

---

## ✅ CHECKLIST:
- [ ] Configurar Site URL no Supabase
- [ ] Adicionar Redirect URLs (localhost + produção)
- [ ] Verificar Email Templates
- [ ] Adicionar NEXT_PUBLIC_SITE_URL no Vercel
- [ ] Testar criando nova conta

---

## 🧪 TESTAR:

1. Crie uma conta com email real
2. Verifique se o email chegou
3. Clique no link
4. Deve redirecionar para: `https://SEU-DOMINIO.vercel.app/auth/callback`
5. Se funcionar = ✅ Resolvido!
