# 🔧 Guia de Configuração do Supabase

## Problema Atual

Erro ao criar conta: **"Failed to fetch"**

## Solução Passo a Passo

### 1. Adicionar Service Role Key no .env.local

O webhook do Mercado Pago precisa da chave de serviço para ativar assinaturas.

**Acesse:** https://app.supabase.com/project/jcfqcyayzphcniwsembk/settings/api

**Copie a `service_role` key** e adicione no `.env.local`:

```bash
# Adicione esta linha no .env.local
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

⚠️ **IMPORTANTE:** Esta chave é secreta! Nunca commite no git!

---

### 2. Desabilitar Confirmação de Email (Desenvolvimento)

Por padrão, o Supabase exige que usuários confirmem o email antes de fazer login.

**Passos:**

1. Acesse: https://app.supabase.com/project/jcfqcyayzphcniwsembk/auth/providers
2. Clique em **Email** na lista de providers
3. Role até **"Confirm email"**
4. **Desabilite** a opção "Enable email confirmations"
5. Clique em **Save**

Isso permite que usuários façam login imediatamente após criar a conta.

---

### 3. Verificar se o Schema SQL foi Executado

O sistema precisa das tabelas e funções do banco de dados.

**Acesse:** https://app.supabase.com/project/jcfqcyayzphcniwsembk/sql/new

**Execute o arquivo:** `supabase/schema.sql`

Para verificar se foi executado corretamente:

```sql
-- Execute este SQL para verificar
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'subscriptions', 'quotes', 'clients');
```

Deve retornar 4 tabelas. Se retornar 0, execute o schema.sql novamente.

---

### 4. Testar a Conexão

Após fazer as configurações acima:

1. **Reinicie o servidor dev:**
   ```bash
   npm run dev
   ```

2. **Acesse a página de teste:**
   ```
   http://localhost:3000/test-supabase
   ```

3. Verifique se todos os itens estão com ✅

---

### 5. Testar Cadastro de Usuário

1. Acesse: http://localhost:3000/auth/signup
2. Preencha os dados:
   - Nome completo: "Teste"
   - Email: "seu_email@gmail.com"
   - Senha: "123456" (mínimo 6 caracteres)
3. Clique em "Criar Conta Grátis"

**Resultado esperado:**
- Conta criada com sucesso
- Redirecionado para a página inicial
- Plano FREE ativado automaticamente (3 orçamentos/mês)
- Nome e plano aparecem no canto superior direito

---

## Checklist de Verificação

- [ ] ✅ Adicionei `SUPABASE_SERVICE_ROLE_KEY` no `.env.local`
- [ ] ✅ Desabilitei confirmação de email no Supabase
- [ ] ✅ Executei o schema.sql no Supabase SQL Editor
- [ ] ✅ Verifiquei que as 4 tabelas foram criadas
- [ ] ✅ Reiniciei o servidor dev (`npm run dev`)
- [ ] ✅ Testei a conexão em `/test-supabase`
- [ ] ✅ Consegui criar uma conta de teste

---

## Arquivo .env.local Completo

Seu arquivo `.env.local` deve ficar assim:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://jcfqcyayzphcniwsembk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZnFjeWF5enBoY25pd3NlbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNjY0NTgsImV4cCI6MjA3ODg0MjQ1OH0.k7mWLg7xFtS3oOZR_JJ-TefKfFnM0oO61c1Ca88DOHA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZnFjeWF5enBoY25pd3NlbWJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzI2NjQ1OCwiZXhwIjoyMDc4ODQyNDU4fQ.qlRoevFBhiR_VtmxZPUtmETxlJBQWFJmkJ3ABR1yDGc

# Mercado Pago - MODO TESTE
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-b218a451-a978-4171-a66e-9409f0a7b272
MERCADOPAGO_ACCESS_TOKEN=TEST-8204722334915941-111517-5de9b5ddc61d81077701506aa100aab8-2493608388

# URL da Aplicação
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Erros Comuns

### "Failed to fetch"
- ✅ **Solução:** Desabilite confirmação de email no Supabase

### "relation 'profiles' does not exist"
- ✅ **Solução:** Execute o schema.sql no SQL Editor

### "Invalid API key"
- ✅ **Solução:** Verifique se as chaves no .env.local estão corretas

### Webhook não ativa assinatura
- ✅ **Solução:** Adicione SUPABASE_SERVICE_ROLE_KEY no .env.local

---

## Links Úteis

- **Dashboard Supabase:** https://app.supabase.com/project/jcfqcyayzphcniwsembk
- **API Keys:** https://app.supabase.com/project/jcfqcyayzphcniwsembk/settings/api
- **Auth Providers:** https://app.supabase.com/project/jcfqcyayzphcniwsembk/auth/providers
- **SQL Editor:** https://app.supabase.com/project/jcfqcyayzphcniwsembk/sql/new
- **Table Editor:** https://app.supabase.com/project/jcfqcyayzphcniwsembk/editor

---

## Próximos Passos

Após configurar tudo:

1. ✅ Criar conta de teste
2. ✅ Gerar 3 orçamentos (plano FREE)
3. ✅ Tentar gerar o 4º (deve redirecionar para /upgrade)
4. ✅ Testar fluxo de pagamento
5. ✅ Verificar se o webhook ativa a assinatura

---

**Precisa de ajuda?** Verifique cada item do checklist acima primeiro!
