# 🎯 PASSO A PASSO - O QUE FAZER AGORA

## ✅ O que JÁ ESTÁ PRONTO:

1. ✅ **Mercado Pago configurado** (modo teste)
2. ✅ **Supabase configurado**
3. ✅ **Código todo commitado e no GitHub**
4. ✅ **Sistema de checkout funcionando**
5. ✅ **PDFs com cores personalizáveis**

---

## 📝 O QUE VOCÊ PRECISA FAZER (3 PASSOS):

### PASSO 1: Configurar Tabelas no Supabase (5 minutos)

1. **Acesse:** https://supabase.com/dashboard
2. **Login** (se ainda não está logado)
3. **Selecione o projeto** CalculadoraH2D
4. **Clique em "SQL Editor"** no menu lateral (ícone `</>`)
5. **Clique em "+ New query"**
6. **Abra o arquivo** `supabase-setup.sql` do projeto
7. **COPIE TODO O CONTEÚDO** do arquivo (Ctrl+A, Ctrl+C)
8. **COLE no SQL Editor** do Supabase
9. **Clique em RUN** (ou Ctrl+Enter)
10. **Deve aparecer:** "Success. No rows returned"

✅ **PRONTO!** As tabelas foram criadas.

**Como verificar:** Clique em "Table Editor" no menu lateral. Você deve ver:
- profiles
- subscriptions
- usage_metrics
- quotes_history
- payments

---

### PASSO 2: Configurar Deploy no Vercel (2 minutos)

#### OPÇÃO A - Mudar Branch de Produção (MAIS RÁPIDO):

1. **Acesse:** https://vercel.com/dashboard
2. **Clique no projeto** calculadora-h2d
3. **Settings** > **Git**
4. **Production Branch:** mude de `main` para:
   ```
   claude/chat-access-inquiry-011B4BgpS7reUKRhqp5HSLaC
   ```
5. **Save**
6. **Deployments** > **Redeploy**

#### OU OPÇÃO B - Fazer Merge no GitHub:

1. **Acesse:** https://github.com/newmagnos25/CalculadoraH2D/compare/main...claude/chat-access-inquiry-011B4BgpS7reUKRhqp5HSLaC
2. **Create Pull Request**
3. **Merge Pull Request**
4. Vercel vai deployar automaticamente

---

### PASSO 3: Adicionar Variáveis de Ambiente no Vercel (3 minutos)

1. **No Vercel:** Settings > Environment Variables
2. **Adicione EXATAMENTE estas variáveis:**

```env
NEXT_PUBLIC_SUPABASE_URL
https://yjadhjdegaxunmgckapn.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqYWRoamRlZ2F4dW5tZ2NrYXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMjY5NDgsImV4cCI6MjA3ODgwMjk0OH0.OhnE5akO5gy2_yL0a9NzuBZIIiTau-Uf_Qy-2yotZ7M

MERCADOPAGO_ACCESS_TOKEN
TEST-8204722334915941-111517-5de9b5ddc61d81077701506aa100aab8-2493608388

NEXT_PUBLIC_APP_URL
https://seu-dominio.vercel.app
```

**IMPORTANTE:** Na última variável (`NEXT_PUBLIC_APP_URL`), troque `seu-dominio` pela URL real do Vercel.

Para **CADA** variável:
- Cole o **Nome** (ex: `NEXT_PUBLIC_SUPABASE_URL`)
- Cole o **Valor**
- Marque: **Production**, **Preview** e **Development**
- Clique em **Add**

3. **Depois de adicionar todas:** Deployments > Redeploy

---

## 🧪 TESTAR SE FUNCIONOU (2 minutos)

1. **Aguarde o deploy terminar** (~2-3 minutos)
2. **Acesse:** https://seu-dominio.vercel.app/pricing
3. **Clique em** "Testar 14 Dias Grátis" (plano Professional)
4. **Escolha** Mensal ou Anual
5. **Clique em** "Ir para Pagamento"
6. **Você deve ser redirecionado** para a página do Mercado Pago

**No Mercado Pago, use cartão de TESTE:**
```
Número: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: APRO
```

7. **Após pagar**, você deve voltar para `/checkout/success` ✅

---

## ❓ ESTÁ FUNCIONANDO? CHECKLIST:

- [ ] Supabase tem as 5 tabelas criadas
- [ ] Vercel fez deploy com sucesso
- [ ] Variáveis de ambiente estão configuradas
- [ ] Site abre sem erros
- [ ] Página /pricing funciona
- [ ] Checkout redireciona para Mercado Pago
- [ ] Após pagamento teste, volta para success

---

## 🆘 PROBLEMAS COMUNS:

### "Erro 500" no checkout
**Causa:** Variáveis de ambiente não configuradas
**Solução:** Verifique se TODAS as variáveis foram adicionadas no Vercel

### "Build failed" no Vercel
**Causa:** Branch errada ou erro de TypeScript
**Solução:** Use a branch `claude/chat-access-inquiry-011B4BgpS7reUKRhqp5HSLaC`

### Mercado Pago não abre
**Causa:** Token incorreto ou não configurado
**Solução:** Verifique se `MERCADOPAGO_ACCESS_TOKEN` está correto

---

## 📊 LOGS ÚTEIS:

### Ver logs do Vercel:
1. Vercel Dashboard > Seu Projeto
2. Deployments > Clique no deploy mais recente
3. Function Logs (para ver erros)

### Ver logs do Supabase:
1. Supabase Dashboard
2. Menu lateral > Logs
3. Postgres Logs ou API Logs

### Ver erros no navegador:
1. Abra o site
2. F12 (DevTools)
3. Console (para ver erros JavaScript)
4. Network (para ver falhas de API)

---

## 🎯 RESUMO DO QUE FALTA:

1. ⏳ **Executar SQL no Supabase** (5 min)
2. ⏳ **Configurar Vercel** (2 min)
3. ⏳ **Adicionar variáveis de ambiente** (3 min)
4. ⏳ **Testar checkout** (2 min)

**TOTAL:** ~15 minutos

---

## 🚀 DEPOIS QUE TUDO FUNCIONAR:

### Para colocar em PRODUÇÃO (receber pagamentos reais):

1. No Mercado Pago, pegue o **Access Token de PRODUÇÃO** (começa com `APP_USR-`)
2. No Vercel, **edite** a variável `MERCADOPAGO_ACCESS_TOKEN`
3. Troque de `TEST-...` para `APP_USR-...`
4. **Redeploy**
5. Agora os pagamentos são REAIS! 💰

---

## 💡 DICAS:

- ✅ Não precisa de cartão de crédito no Supabase (é grátis)
- ✅ Use modo TESTE enquanto desenvolve
- ✅ Só mude para PRODUÇÃO quando tiver certeza que funciona
- ✅ Os guias `SETUP-SUPABASE.md` e `SETUP-MERCADOPAGO.md` têm mais detalhes se precisar

---

## ✉️ PRECISA DE AJUDA?

Se algo der errado:
1. **Me mande:** Qual passo você está (1, 2 ou 3)
2. **Me mande:** Print do erro ou mensagem que apareceu
3. **Me mande:** Logs do Vercel ou console do navegador

Vou te ajudar! 🙌
