# 🚀 GUIA RÁPIDO: Como Ativar o Mercado Pago

## ✅ PDF Orçamento CORRIGIDO
- Valor total não quebra mais entre páginas
- Usa `breakInside: 'avoid'` para manter tudo junto

---

## 📍 Status Atual (O QUE JÁ FUNCIONA)

✅ Calculadora 3D - **100% funcional**
✅ PDFs Orçamento e Contrato - **Otimizados**
✅ Página de Preços - `/pricing`
✅ Sistema de Checkout - `/checkout/[tier]`
✅ API Mercado Pago - `/api/checkout`
✅ Webhook - `/api/webhooks/mercadopago`
✅ **MODO TESTE** - Tudo configurado com credenciais TEST

**Você pode TESTAR AGORA mesmo em:**
👉 `https://calculadorah2-d.vercel.app/pricing`

---

## 🔴 O QUE FALTA PARA IR AO AR (3 passos)

### PASSO 1: Pegar Credenciais de PRODUÇÃO

1. Entre em: https://www.mercadopago.com.br/developers/panel
2. No canto superior direito, mude de **"Modo teste"** para **"Modo produção"**
3. Vá em **"Credenciais"** → **"Credenciais de produção"**
4. Copie:
   - `Public Key` (começa com `APP_USR-...`)
   - `Access Token` (começa com `APP_USR-...`)

### PASSO 2: Atualizar no Vercel

1. Entre em: https://vercel.com/newmagnos25/calculadorah2-d
2. Vá em **"Settings"** → **"Environment Variables"**
3. Edite ou adicione:
   - `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` = sua Public Key de PRODUÇÃO
   - `MERCADOPAGO_ACCESS_TOKEN` = seu Access Token de PRODUÇÃO
4. Clique em **"Save"**
5. Vá em **"Deployments"** e clique em **"Redeploy"**

### PASSO 3: Configurar Webhook no Mercado Pago

1. Ainda em: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Webhooks"** (menu lateral)
3. Clique em **"Criar webhook"** ou **"Adicionar URL"**
4. Cole a URL:
   ```
   https://calculadorah2-d.vercel.app/api/webhooks/mercadopago
   ```
5. Marque os eventos:
   - ✅ Pagamentos (`payment`)
   - ✅ Planos (`plan`)
   - ✅ Assinaturas (`subscription`)
6. Clique em **"Salvar"**

---

## 🎯 Como Testar AGORA (Modo Teste)

1. Acesse: https://calculadorah2-d.vercel.app/pricing
2. Escolha um plano (Starter, Professional ou Business)
3. Clique em **"Assinar"**
4. Use um **cartão de teste** do Mercado Pago:

   **APROVADO:**
   - Número: `5031 4332 1540 6351`
   - CVV: `123`
   - Validade: qualquer data futura
   - Nome: qualquer nome

   **MAIS CARTÕES DE TESTE:**
   - https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards

5. Você será redirecionado para o checkout do Mercado Pago
6. Após pagamento, volta para `/checkout/success`

---

## 💰 Preços Atuais

| Plano | Mensal | Anual | Economia |
|-------|--------|-------|----------|
| Starter | R$ 29,90 | R$ 299,00 | R$ 59,80/ano |
| Professional | R$ 79,90 | R$ 799,00 | R$ 159,80/ano |
| Business | R$ 199,90 | R$ 1.999,00 | R$ 399,80/ano |

---

## 🔗 Links Importantes

- **Painel Mercado Pago:** https://www.mercadopago.com.br/developers/panel
- **Documentação Webhooks:** https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
- **Cartões de Teste:** https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards
- **Vercel Dashboard:** https://vercel.com/newmagnos25/calculadorah2-d

---

## 🐛 Se Algo Der Errado

### Erro: "Link de pagamento não gerado"
- Verifique se as credenciais estão corretas no Vercel
- Confira se você fez Redeploy após mudar as variáveis

### Webhook não está funcionando
- Verifique a URL no painel do Mercado Pago
- Certifique-se que a URL está sem `/` no final
- Teste com a ferramenta de teste do próprio Mercado Pago

### Pagamento não aparece no site
- Verifique os logs no Vercel: Settings → Functions → Ver logs
- O webhook pode demorar alguns segundos

---

## 📞 Precisa de Ajuda?

1. Veja os logs do Vercel
2. Entre no painel do Mercado Pago e veja "Movimentações"
3. Me chame no chat se precisar!

---

**PRONTO! Depois dos 3 passos, seu site estará 100% funcional e aceitando pagamentos reais! 🎉**
