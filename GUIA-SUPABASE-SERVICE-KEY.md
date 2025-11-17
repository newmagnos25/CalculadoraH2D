# 🔑 Como Adicionar SUPABASE_SERVICE_ROLE_KEY no Vercel

## ❌ Erro que Você Está Vendo

Ao tentar usar `/admin/activate`:
```json
{
  "error": "Configuração do servidor incompleta",
  "details": "SUPABASE_SERVICE_ROLE_KEY não configurada no Vercel"
}
```

## ✅ Solução Rápida (5 minutos)

### Passo 1: Pegar a Service Role Key do Supabase

1. Abra: https://supabase.com/dashboard
2. Selecione seu projeto
3. **Settings** (engrenagem no menu lateral esquerdo)
4. **API**
5. Procure por **"Project API keys"**
6. Encontre: **`service_role` secret**
   - Vai estar escrito algo como: `eyJhb...` (bem longo)
7. **Clique no ícone de "copiar"** 📋

⚠️ **IMPORTANTE:** É o **service_role**, NÃO o **anon** key!

### Passo 2: Adicionar no Vercel

1. Abra: https://vercel.com/dashboard
2. Selecione seu projeto (**CalculadoraH2D** ou **Precifica3D**)
3. **Settings** (menu superior)
4. **Environment Variables** (menu lateral)
5. Clique em **"Add New"**

Preencha:
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [COLE A KEY QUE VOCÊ COPIOU]
Environment: ✅ Production, ✅ Preview, ✅ Development (marcar todos)
```

6. Clique **Save**

### Passo 3: Redeploy

**CRÍTICO:** Precisa fazer redeploy para variáveis funcionarem!

#### Opção A: Via Interface (Fácil)
1. No Vercel → **Deployments** (menu superior)
2. Clique nos **3 pontinhos** do último deploy
3. **Redeploy**
4. ✅ Pronto!

#### Opção B: Via Git (Rápido)
```bash
git commit --allow-empty -m "trigger deploy"
git push
```

### Passo 4: Testar

Aguarde 2-3 minutos do deploy terminar, depois teste:

1. https://precifica3d.vercel.app/admin/activate
2. Preencha o formulário
3. **Deve funcionar agora!** ✅

---

## 🔍 Como Verificar Se Funcionou

### Se Funcionou:
```json
{
  "success": true,
  "message": "Assinatura ativada com sucesso",
  "data": { ... }
}
```

### Se Ainda Não Funcionou:
```json
{
  "error": "Configuração do servidor incompleta",
  ...
}
```

**O que fazer:**
1. Verificar se copiou a key **service_role** (não a anon)
2. Verificar se marcou **Production, Preview, Development**
3. Verificar se fez **Redeploy**
4. Aguardar 2-3 minutos do deploy terminar

---

## 📋 Checklist de Variáveis de Ambiente

Você deve ter no Vercel:

- [x] `NEXT_PUBLIC_SUPABASE_URL` ✅ (você já tem)
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅ (você já tem)
- [x] `ADMIN_SECRET` ✅ (você já configurou)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **FALTA ESSA!**
- [x] `MERCADOPAGO_ACCESS_TOKEN` ✅ (se tiver)

---

## 🆘 Problemas Comuns

### "Não encontro a service_role key"

Caminho completo:
1. Dashboard Supabase
2. Projeto
3. **Settings** (engrenagem esquerda)
4. **API** (não confundir com Authentication!)
5. Seção **"Project API keys"**
6. **service_role** (normalmente segunda key)

### "Copiei mas ainda dá erro"

- ✅ Fez **Redeploy**?
- ✅ Aguardou 2-3 min?
- ✅ Marcou **Production**?
- ✅ Copiou a key **inteira** (500+ caracteres)?

### "Funciona local mas não no Vercel"

Isso é normal! No Vercel precisa configurar nas Environment Variables.

Local (.env.local):
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
```

Vercel:
- Settings → Environment Variables → Adicionar

---

## 🎯 Por Que Preciso Disso?

### ANON Key (Você Já Tem):
- Acesso público
- Limitado por RLS (Row Level Security)
- Seguro para usar no frontend

### SERVICE ROLE Key (Falta):
- Acesso ADMIN
- **Ignora** RLS
- Só pode usar no **servidor** (API routes)
- Usado para:
  - Ativar planos manualmente
  - Confirmar emails
  - Cancelar assinaturas
  - Operações administrativas

---

## 📚 Links Úteis

- Dashboard Supabase: https://supabase.com/dashboard
- Dashboard Vercel: https://vercel.com/dashboard
- Docs Vercel - Env Vars: https://vercel.com/docs/environment-variables

---

**Última atualização:** 2025-11-17
**Status:** Guia completo ✅
