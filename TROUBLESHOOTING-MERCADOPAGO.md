# 🚨 TROUBLESHOOTING COMPLETO - Mercado Pago

## ❌ PROBLEMA: Cartões de teste não funcionam

**Você reportou:**
- "Não é possível continuar o pagamento com este cartão"
- Usando cartões de teste
- Configurou variáveis no Vercel

---

## ✅ CHECKLIST DE VERIFICAÇÃO

### 1️⃣ NOMES DAS VARIÁVEIS (COPIE EXATAMENTE)

⚠️ **ATENÇÃO:** Os nomes TÊM que estar EXATOS, inclusive maiúsculas!

Você disse que colocou:
- ❌ `NEXT_PUBLIC_MERCADOPAG` (ERRADO - falta "O")
- ❌ `MERCADOPAGO_ACCES` (ERRADO - falta "S")

**NOMES CORRETOS:**
```
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
MERCADOPAGO_ACCESS_TOKEN
```

**Copie e cole EXATAMENTE assim no Vercel!**

---

### 2️⃣ VALORES DAS VARIÁVEIS (MODO TESTE)

**Para MODE TESTE (cartões de teste):**

```
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY = TEST-b218a451-a978-4171-a66e-9409f0a7b272

MERCADOPAGO_ACCESS_TOKEN = TEST-8204722334915941-111517-5de9b5ddc61d81077701506aa100aab8-2493608388
```

⚠️ **SEM ESPAÇOS antes ou depois do =**

---

### 3️⃣ ADICIONAR MAIS 1 VARIÁVEL (IMPORTANTE!)

O código precisa dessa variável para os back_urls funcionarem:

```
NEXT_PUBLIC_APP_URL = https://calculadora-h2d-git-claude-chat-319f5e-brunos-projects-9415a210.vercel.app
```

**OU** (se você quer usar o outro domínio):

```
NEXT_PUBLIC_APP_URL = https://calculadora-h2d-l0lx1cct3-brunos-projects-9415a210.vercel.app
```

---

### 4️⃣ COMO CONFIGURAR NO VERCEL (PASSO A PASSO)

1. Entre em: https://vercel.com/brunos-projects-9415a210/calculadora-h2d

2. Clique em **"Settings"**

3. No menu lateral, clique em **"Environment Variables"**

4. **DELETAR** variáveis antigas se existirem:
   - Delete `NEXT_PUBLIC_MERCADOPAG` (nome errado)
   - Delete `MERCADOPAGO_ACCES` (nome errado)

5. **ADICIONAR** as 3 variáveis corretas:

   **Variável 1:**
   ```
   Name: NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
   Value: TEST-b218a451-a978-4171-a66e-9409f0a7b272
   ```
   Environments: ✅ Production ✅ Preview ✅ Development
   → Clique em **"Add"**

   **Variável 2:**
   ```
   Name: MERCADOPAGO_ACCESS_TOKEN
   Value: TEST-8204722334915941-111517-5de9b5ddc61d81077701506aa100aab8-2493608388
   ```
   Environments: ✅ Production ✅ Preview ✅ Development
   → Clique em **"Add"**

   **Variável 3:**
   ```
   Name: NEXT_PUBLIC_APP_URL
   Value: https://calculadora-h2d-git-claude-chat-319f5e-brunos-projects-9415a210.vercel.app
   ```
   Environments: ✅ Production ✅ Preview ✅ Development
   → Clique em **"Add"**

6. **Clique em "Save"** em cada uma

7. **REDEPLOY OBRIGATÓRIO:**
   - Vá em **"Deployments"**
   - Clique nos 3 pontinhos da última deployment
   - Clique em **"Redeploy"**
   - **AGUARDE** até finalizar (uns 2-3 minutos)

---

### 5️⃣ CARTÕES DE TESTE QUE FUNCIONAM

Depois do redeploy, use ESTES cartões:

**✅ APROVADO:**
```
Número: 5031 4332 1540 6351
Nome: APRO
CPF: 123.456.789-00
CVV: 123
Validade: 11/25
```

**✅ PENDENTE:**
```
Número: 5031 4332 1540 6351
Nome: PEND
CPF: 123.456.789-00
CVV: 123
Validade: 11/25
```

**❌ REJEITADO (para testar erro):**
```
Número: 5031 4332 1540 6351
Nome: OTHE
CPF: 123.456.789-00
CVV: 123
Validade: 11/25
```

⚠️ **O NOME NO CARTÃO É IMPORTANTE!** É ele que define se aprova ou não.

---

### 6️⃣ COMO TESTAR (PASSO A PASSO)

1. **Aguarde o Redeploy terminar** (muito importante!)

2. Acesse: https://calculadora-h2d-git-claude-chat-319f5e-brunos-projects-9415a210.vercel.app/pricing

3. Clique em **"Começar Agora"** no plano Starter

4. Escolha **"Mensal"**

5. Clique em **"Pagar com Mercado Pago"**

6. Você será redirecionado para o checkout do MP

7. Preencha com o cartão de teste:
   - Número: `5031 4332 1540 6351`
   - Nome: `APRO` (importante!)
   - CPF: `12345678900`
   - CVV: `123`
   - Validade: `11/25`

8. Se aparecer "Pagamento aprovado", FUNCIONOU! ✅

---

## 🔍 COMO VERIFICAR SE ESTÁ CONFIGURADO CERTO

### Opção 1: Ver as Variáveis no Vercel

1. Settings → Environment Variables
2. Você deve ver EXATAMENTE 3 variáveis:
   - ✅ `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
   - ✅ `MERCADOPAGO_ACCESS_TOKEN`
   - ✅ `NEXT_PUBLIC_APP_URL`

### Opção 2: Ver Logs do Vercel

1. Vá em **"Functions"** no Vercel
2. Clique em **"View Function Logs"**
3. Tente fazer um pagamento
4. Veja os logs:

**SE APARECER:**
```
MERCADOPAGO_ACCESS_TOKEN não configurado
```
❌ **A variável não está lá ou o nome está errado**

**SE APARECER:**
```
Mercado Pago API Error: { message: "invalid credentials" }
```
❌ **O token está errado ou é de PRODUÇÃO (não TEST)**

**SE NÃO APARECER NENHUM ERRO:**
✅ **Está funcionando!**

---

## 🎯 RESOLUÇÃO MAIS COMUM

**90% dos casos é:**
1. ❌ Nome da variável errado
2. ❌ Esqueceu de fazer Redeploy
3. ❌ Usando token de PRODUÇÃO com cartão de TESTE

**Solução:**
1. ✅ Conferir os 3 nomes EXATOS
2. ✅ Redeploy e AGUARDAR
3. ✅ Usar tokens de TEST

---

## 📸 EXEMPLO VISUAL DAS VARIÁVEIS

Suas variáveis devem aparecer ASSIM no Vercel:

```
Environment Variables

NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
Value: TEST-b218a451-a978-4171-a66e-9409f0a7b272
Environments: Production, Preview, Development

MERCADOPAGO_ACCESS_TOKEN
Value: TEST-8204722334915941-111517-5de9b5ddc61d81077701506aa100aab8-2493608388
Environments: Production, Preview, Development

NEXT_PUBLIC_APP_URL
Value: https://calculadora-h2d-git-claude-chat-319f5e-brunos-projects-9415a210.vercel.app
Environments: Production, Preview, Development
```

---

## ⚠️ ERROS COMUNS E SOLUÇÕES

### Erro 1: "Não é possível continuar o pagamento com este cartão"

**Causa:** Token de PRODUÇÃO + Cartão de TESTE

**Solução:**
- Conferir se o token começa com `TEST-`
- Redeploy após trocar

---

### Erro 2: "Link de pagamento não gerado"

**Causa:** Variável `MERCADOPAGO_ACCESS_TOKEN` não configurada ou nome errado

**Solução:**
- Conferir nome EXATO da variável
- Verificar logs: Settings → Functions → View Logs

---

### Erro 3: Redireciona mas dá erro no MP

**Causa:** `NEXT_PUBLIC_APP_URL` não configurada

**Solução:**
- Adicionar a variável com sua URL do Vercel
- Redeploy

---

### Erro 4: Paga mas não volta para o site

**Causa:** `back_urls` apontando para localhost

**Solução:**
- Configurar `NEXT_PUBLIC_APP_URL`
- Redeploy

---

## 🎬 RESUMO DO QUE FAZER AGORA

1. ✅ **Deletar** variáveis antigas (com nome errado)
2. ✅ **Adicionar** as 3 variáveis com nomes EXATOS
3. ✅ **Redeploy** e AGUARDAR terminar
4. ✅ **Testar** com cartão `APRO`
5. ✅ **Ver logs** se der erro

---

## 🆘 SE AINDA NÃO FUNCIONAR

Me manda:
1. **Screenshot das Environment Variables** (pode tampar parte dos valores)
2. **Screenshot do erro** que aparece
3. **Logs do Vercel** (Settings → Functions → View Logs)

Aí eu vejo exatamente o que tá errado!

---

**DICA DE OURO:**
O erro mais comum é **nome da variável errado**. Copie e cole os nomes, NÃO digite na mão!

Testa aí e me fala! 🚀
