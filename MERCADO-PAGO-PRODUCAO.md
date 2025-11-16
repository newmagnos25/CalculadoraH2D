# 💳 Guia: Mercado Pago em Produção

Este guia mostra como **sair do modo teste** e aceitar **pagamentos reais** no Mercado Pago.

---

## 📋 Pré-requisitos

- Site já deployado na Vercel (veja: `GUIA-DEPLOY-VERCEL.md`)
- Conta no Mercado Pago
- Documentos para ativar conta vendedor

---

## Passo 1: Criar Conta Vendedor no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/
2. Clique em **"Vender com Mercado Pago"**
3. Faça login ou crie uma conta
4. Complete o cadastro:
   - CPF/CNPJ
   - Dados bancários (para receber pagamentos)
   - Documentos de identificação

⚠️ **IMPORTANTE:** A conta precisa ser **aprovada** pelo Mercado Pago. Isso pode levar alguns dias.

---

## Passo 2: Obter Credenciais de PRODUÇÃO

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Clique em **"Suas integrações"** → **"Criar aplicação"**
3. Preencha:
   - **Nome:** CalculadoraH2D PRO
   - **Modelo de negócio:** Marketplace ou SaaS
   - **Redirect URI:** `https://seu-site.vercel.app/checkout/success`
4. Clique em **"Criar"**

5. Vá em **"Credenciais de produção"**
6. Copie as credenciais:
   - **Public Key:** Começa com `APP_USR-` (não `TEST-`)
   - **Access Token:** Começa com `APP_USR-` (não `TEST-`)

---

## Passo 3: Atualizar Variáveis de Ambiente na Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto **CalculadoraH2D**
3. Vá em **"Settings"** → **"Environment Variables"**

4. **Edite** estas variáveis:

```
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
APP_USR-sua-public-key-de-producao
```

```
MERCADOPAGO_ACCESS_TOKEN
APP_USR-seu-access-token-de-producao
```

5. Clique em **"Save"**

6. Vá em **"Deployments"** → **3 pontinhos** → **"Redeploy"** para aplicar as mudanças

---

## Passo 4: Configurar Webhook do Mercado Pago

O webhook é essencial para ativar assinaturas automaticamente quando o pagamento é aprovado.

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Selecione sua aplicação
3. Vá em **"Webhooks"** (menu lateral)
4. Clique em **"Configurar webhooks"**

5. Preencha:
   - **URL de produção:** `https://seu-site.vercel.app/api/webhooks/mercadopago`
   - **Eventos:** Selecione **"Pagamentos"** (payments)
   - **Versão da API:** v1

6. Clique em **"Salvar"**

7. **Teste o webhook:**
   - Na mesma tela, clique em **"Simular"**
   - Envie uma notificação de teste
   - Verifique se retorna status `200 OK`

---

## Passo 5: Testar Pagamento Real

⚠️ **ATENÇÃO:** Agora você vai fazer um pagamento **REAL** para testar!

1. Acesse seu site: `https://seu-site.vercel.app`
2. Faça login
3. Use os 3 orçamentos grátis
4. Clique em **"Fazer Upgrade"**
5. Escolha um plano (pode escolher o mais barato para testar)
6. Use um **cartão de crédito real** para pagar

7. Após o pagamento:
   - Você deve ser redirecionado para `/checkout/success`
   - O webhook deve ativar a assinatura automaticamente
   - Verifique no Supabase se a assinatura foi atualizada

8. Teste gerar mais orçamentos para confirmar que o limite aumentou

---

## Passo 6: Configurar Preços dos Planos

Os preços estão definidos em `/app/pricing/page.tsx` e `/lib/pricing.ts` (se existir).

**Preços sugeridos:**

```
FREE: R$ 0,00 - 3 orçamentos/mês
STARTER: R$ 49,90/mês - 50 orçamentos/mês
PROFESSIONAL: R$ 149,90/mês - Orçamentos ilimitados
ENTERPRISE: R$ 999,00/ano - Orçamentos ilimitados + Suporte
LIFETIME: R$ 997,00 (pagamento único) - Acesso vitalício
```

Você pode ajustar esses valores de acordo com seu mercado.

---

## Passo 7: Cancelar Teste (Estornar Pagamento)

Se fez um pagamento de teste e quer estornar:

1. Acesse: https://www.mercadopago.com.br/activities
2. Encontre o pagamento de teste
3. Clique em **"Ver mais"** → **"Devolver dinheiro"**
4. Confirme o estorno

O dinheiro volta para o cartão em 5-10 dias úteis.

---

## 🔒 Segurança

### Proteja suas credenciais de produção

- ❌ **NUNCA** commite credenciais de produção no git
- ✅ Sempre use variáveis de ambiente na Vercel
- ✅ Access Token tem que ficar **secreto**
- ✅ Public Key pode ser exposta no frontend

### Boas práticas

- Configure notificações de pagamento no Mercado Pago
- Monitore transações diariamente
- Configure limites de valor (se aplicável)
- Tenha um email de suporte ativo

---

## 📊 Monitoramento

### No Mercado Pago:

Acesse: https://www.mercadopago.com.br/activities

Você pode ver:
- Pagamentos aprovados
- Pagamentos pendentes
- Estornos
- Taxas cobradas

### No Supabase:

Acesse: https://app.supabase.com/project/jcfqcyayzphcniwsembk/editor

Verifique:
- Tabela `subscriptions` - Assinaturas ativas
- Tabela `quotes` - Orçamentos gerados
- Tabela `profiles` - Usuários cadastrados

---

## 💰 Taxas do Mercado Pago

O Mercado Pago cobra:
- **~4,99% + R$ 0,39** por transação aprovada (cartão de crédito)
- **~2,49%** para Pix
- **Sem mensalidade** (plano gratuito)

**Exemplo:**
- Venda de R$ 49,90
- Taxa: R$ 2,88
- Você recebe: R$ 47,02

Os valores caem na sua conta **D+14** (14 dias após a venda).

---

## 🔄 Renovação de Assinaturas

**ATENÇÃO:** O sistema atual **NÃO** faz renovação automática!

Cada pagamento ativa a assinatura por:
- Mensal: 30 dias
- Anual: 1 ano
- Lifetime: 100 anos (permanente)

**Para implementar renovação automática**, você precisa:
1. Usar Mercado Pago **Assinaturas** (planos recorrentes)
2. Atualizar o código do checkout
3. Configurar webhooks adicionais

📚 **Documentação:** https://www.mercadopago.com.br/developers/pt/docs/subscriptions/integration-configuration

---

## ❓ Troubleshooting

### Erro: "Webhook não está recebendo notificações"

1. Verifique se a URL está correta: `https://seu-site.vercel.app/api/webhooks/mercadopago`
2. Teste manualmente:
```bash
curl -X POST https://seu-site.vercel.app/api/webhooks/mercadopago \
  -H "Content-Type: application/json" \
  -d '{"type":"payment","data":{"id":"123"}}'
```
3. Verifique os logs na Vercel: **Deployments** → **Functions** → Procure por erros

### Erro: "Pagamento aprovado mas assinatura não ativou"

1. Verifique se o webhook foi recebido (logs da Vercel)
2. Confirme que `SUPABASE_SERVICE_ROLE_KEY` está configurada
3. Verifique se o email do pagador existe na tabela `profiles`
4. Veja os logs do webhook no console da Vercel

### Erro: "Invalid credentials"

- Confirme que está usando credenciais de **PRODUÇÃO** (começam com `APP_USR-`)
- Não use credenciais de **TESTE** (começam com `TEST-`)

---

## ✅ Checklist de Produção

- [ ] Conta vendedor aprovada no Mercado Pago
- [ ] Credenciais de PRODUÇÃO obtidas (APP_USR-)
- [ ] Variáveis atualizadas na Vercel
- [ ] Webhook configurado e testado
- [ ] Pagamento de teste realizado e funcionou
- [ ] Assinatura ativada automaticamente
- [ ] Email de suporte configurado
- [ ] Monitoramento ativo (Mercado Pago + Supabase)

---

## 🎉 Pronto para Vender!

Agora você pode:
- ✅ Aceitar pagamentos reais
- ✅ Ativar assinaturas automaticamente
- ✅ Gerar receita com o sistema

**Boa sorte com as vendas!** 🚀

---

## 📞 Suporte

- **Mercado Pago:** https://www.mercadopago.com.br/developers/pt/support
- **Vercel:** https://vercel.com/support
- **Supabase:** https://supabase.com/support

---

## 📚 Links Úteis

- Dashboard Mercado Pago: https://www.mercadopago.com.br/developers/panel/app
- Documentação API: https://www.mercadopago.com.br/developers/pt/reference
- Simulador de Webhooks: No painel do desenvolvedor
- Status dos serviços: https://status.mercadopago.com.br
