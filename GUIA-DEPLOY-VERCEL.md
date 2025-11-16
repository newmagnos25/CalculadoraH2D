# 🚀 Guia de Deploy na Vercel

Este guia mostra como fazer deploy da CalculadoraH2D PRO na Vercel e configurar todas as variáveis de ambiente.

---

## 📋 Pré-requisitos

- Conta no GitHub (já tem ✅)
- Conta na Vercel (gratuita): https://vercel.com/signup
- Projeto já está no GitHub

---

## Passo 1: Criar Conta na Vercel

1. Acesse: https://vercel.com/signup
2. Clique em **"Continue with GitHub"**
3. Autorize a Vercel a acessar seus repositórios

---

## Passo 2: Importar Projeto

1. No dashboard da Vercel, clique em **"Add New"** → **"Project"**
2. Procure por **"CalculadoraH2D"** na lista de repositórios
3. Clique em **"Import"**

---

## Passo 3: Configurar Variáveis de Ambiente

**IMPORTANTE:** Antes de fazer deploy, você precisa adicionar as variáveis de ambiente!

1. Na tela de configuração do projeto, role até **"Environment Variables"**

2. Adicione cada variável abaixo:

### Supabase

```
NEXT_PUBLIC_SUPABASE_URL
https://jcfqcyayzphcniwsembk.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZnFjeWF5enBoY25pd3NlbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNjY0NTgsImV4cCI6MjA3ODg0MjQ1OH0.k7mWLg7xFtS3oOZR_JJ-TefKfFnM0oO61c1Ca88DOHA
```

```
SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZnFjeWF5enBoY25pd3NlbWJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzI2NjQ1OCwiZXhwIjoyMDc4ODQyNDU4fQ.qlRoevFBhiR_VtmxZPUtmETxlJBQWFJmkJ3ABR1yDGc
```

### Mercado Pago (MODO TESTE - por enquanto)

```
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
TEST-b218a451-a978-4171-a66e-9409f0a7b272
```

```
MERCADOPAGO_ACCESS_TOKEN
TEST-8204722334915941-111517-5de9b5ddc61d81077701506aa100aab8-2493608388
```

### URL da Aplicação

```
NEXT_PUBLIC_APP_URL
https://seu-projeto.vercel.app
```

⚠️ **IMPORTANTE:** Deixe `NEXT_PUBLIC_APP_URL` em branco por enquanto! Você vai preencher depois que a Vercel gerar a URL.

3. Clique em **"Deploy"**

---

## Passo 4: Aguardar Deploy

A Vercel vai:
- ✅ Instalar dependências (`npm install`)
- ✅ Buildar o projeto (`npm run build`)
- ✅ Fazer deploy

Isso leva ~2-5 minutos.

---

## Passo 5: Atualizar URL da Aplicação

1. Quando o deploy terminar, copie a URL gerada (exemplo: `https://calculadora-h2d.vercel.app`)

2. Vá em **"Settings"** → **"Environment Variables"**

3. Edite a variável `NEXT_PUBLIC_APP_URL` e cole a URL

4. Clique em **"Save"**

5. Vá em **"Deployments"** → Clique nos **3 pontinhos** do deployment mais recente → **"Redeploy"**

---

## Passo 6: Testar o Site

1. Acesse a URL do seu site (exemplo: `https://calculadora-h2d.vercel.app`)

2. Teste:
   - ✅ Criar uma conta
   - ✅ Fazer login
   - ✅ Gerar 3 orçamentos (plano FREE)
   - ✅ Verificar se aparece página de upgrade

---

## Passo 7: Configurar Domínio Personalizado (Opcional)

Se você tiver um domínio próprio:

1. Vá em **"Settings"** → **"Domains"**
2. Clique em **"Add"**
3. Digite seu domínio (exemplo: `calculadorah2d.com.br`)
4. Siga as instruções para configurar o DNS

---

## 🔒 Segurança: Variáveis Secretas

**NUNCA commite estas chaves no git:**
- ❌ `SUPABASE_SERVICE_ROLE_KEY`
- ❌ `MERCADOPAGO_ACCESS_TOKEN`

Elas devem ficar **apenas** nas variáveis de ambiente da Vercel!

---

## 🔄 Deploys Automáticos

A partir de agora, **toda vez que você der push no GitHub**, a Vercel vai:
1. Detectar as mudanças automaticamente
2. Fazer deploy da nova versão
3. Atualizar o site em ~2 minutos

---

## 🐛 Troubleshooting

### Erro: "Build failed"
- Verifique se todas as variáveis de ambiente estão configuradas
- Veja os logs do build na Vercel para detalhes

### Erro: "Failed to fetch" ao fazer login
- Confirme que `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretas
- Verifique se desabilitou confirmação de email no Supabase

### Mercado Pago não funciona
- No modo teste, o webhook localhost não vai funcionar
- Você precisa configurar para produção (veja: `MERCADO-PAGO-PRODUCAO.md`)

---

## 📊 Monitoramento

A Vercel oferece:
- **Analytics**: Ver quantas pessoas acessam o site
- **Logs**: Ver erros em tempo real
- **Deployments**: Histórico de todas as versões

Acesse tudo isso no dashboard: https://vercel.com/dashboard

---

## ✅ Checklist Final

- [ ] Projeto importado na Vercel
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] `NEXT_PUBLIC_APP_URL` atualizada com URL da Vercel
- [ ] Site funcionando (login, criar conta, gerar orçamentos)
- [ ] Domínio personalizado configurado (opcional)

---

## 🎉 Pronto!

Seu site está no ar! Agora você pode:
1. Compartilhar o link com clientes
2. Configurar Mercado Pago para produção
3. Aceitar pagamentos reais

**Próximo passo:** Leia `MERCADO-PAGO-PRODUCAO.md` para sair do modo teste!
