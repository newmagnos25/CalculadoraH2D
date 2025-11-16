# 🔧 INSTRUÇÕES COMPLETAS - Pagamento de Teste

## ⚠️ ATENÇÃO: Validade correta é **11/30** (não 11/25!)

---

## 📋 FORMULÁRIO DE TESTE (Use EXATAMENTE assim)

Quando abrir o checkout do Mercado Pago, preencha:

### 🔹 E-mail:
```
test_user@testuser.com
```

### 🔹 Número do Cartão Mastercard:
```
5031 4332 1540 6351
```
(Pode digitar sem espaços)

### 🔹 Nome do Titular (CRÍTICO!):
```
APRO
```

⚠️ **MUITO IMPORTANTE:**
- Tem que ser **APRO** (tudo maiúsculo)
- Não pode ser "apro" (minúsculo) ❌
- Não pode ser "Apro" (misto) ❌
- Tem que ser **APRO** (maiúsculo) ✅

**Por quê?** O nome do titular é o que define o resultado no modo teste:
- `APRO` = Pagamento **Aprovado** ✅
- `OTHE` = Pagamento **Rejeitado** ❌
- `CONT` = Pagamento **Pendente** ⏳
- `CALL` = Pagamento requer **validação** 📞
- `FUND` = **Saldo insuficiente** 💰
- `SECU` = **CVV inválido** 🔒
- `EXPI` = **Vencimento inválido** 📅
- `FORM` = **Erro no formulário** 📝

### 🔹 Vencimento:
```
11/30
```
⚠️ **NÃO é 11/25!** É **11/30**!

### 🔹 Código de Segurança:
```
123
```

### 🔹 CPF:
```
12345678909
```

### 🔹 Número de Parcelas:
```
1x (à vista)
```

---

## 🎯 TESTE COMPLETO (Siga exatamente essa ordem)

### PASSO 1: Limpar Cache
1. Feche todos os navegadores
2. Abra de novo
3. Vá para: https://calculadora-h2d-git-claude-chat-319f5e-brunos-projects-9415a210.vercel.app/pricing
4. Aperte **Ctrl + Shift + R** (força limpar cache)

### PASSO 2: Iniciar Checkout
1. Na página de pricing, clique em **"Começar Agora"** no plano **Starter**
2. Escolha **"Mensal"**
3. Clique em **"Ir para Pagamento"**

### PASSO 3: Verificar Sandbox
- Você será redirecionado para: `https://sandbox.mercadopago.com.br/checkout/...`
- Se a URL tem **sandbox**, está correto! ✅

### PASSO 4: Preencher Formulário
Preencha **EXATAMENTE** como especificado acima:

```
┌────────────────────────────────────────┐
│ E-mail:                                │
│ test_user@testuser.com                 │
├────────────────────────────────────────┤
│ Número do cartão:                      │
│ 5031 4332 1540 6351                    │
├────────────────────────────────────────┤
│ Nome do titular: (IMPORTANTE!)         │
│ APRO                            ← ISSO │
├────────────────────────────────────────┤
│ Vencimento:     Código:                │
│ 11/30           123                    │
├────────────────────────────────────────┤
│ CPF:                                   │
│ 12345678909                            │
├────────────────────────────────────────┤
│ Parcelas:                              │
│ 1x                                     │
└────────────────────────────────────────┘
```

### PASSO 5: Clicar em Pagar
- Clique no botão **"Pagar"**
- Aguarde processamento (2-5 segundos)

### PASSO 6: Resultado Esperado
✅ **Deve aparecer:**
- Mensagem: "Pagamento aprovado!"
- Redirecionar para: `/checkout/success`

❌ **Se aparecer erro:**
- Revise TODOS os campos
- Verifique se o nome é **APRO** (maiúsculo)
- Verifique se a validade é **11/30** (não 11/25)
- Verifique se preencheu CPF

---

## 🧪 OUTROS CARTÕES DE TESTE

Se quiser testar com outros cartões:

### Cartão VISA:
```
Número: 4235 6477 2802 5682
Nome: APRO
Vencimento: 11/30
CVV: 123
CPF: 12345678909
```

### American Express:
```
Número: 3753 651535 56885
Nome: APRO
Vencimento: 11/30
CVV: 1234 (4 dígitos para Amex)
CPF: 12345678909
```

### Elo Débito:
```
Número: 5067 7667 8388 8311
Nome: APRO
Vencimento: 11/30
CVV: 123
CPF: 12345678909
```

---

## 🔍 CHECKLIST ANTES DE TESTAR

Antes de clicar em "Pagar", verifique:

- [ ] Limpei cache (Ctrl + Shift + R)
- [ ] Página mostra "7 dias" (não 14)
- [ ] Fui para sandbox.mercadopago.com.br ✅
- [ ] E-mail preenchido
- [ ] Cartão: 5031 4332 1540 6351
- [ ] Nome: **APRO** (maiúsculo, todas as letras)
- [ ] Vencimento: **11/30** (não 11/25!)
- [ ] CVV: 123
- [ ] CPF: 12345678909
- [ ] Parcelas: 1x
- [ ] Todos os campos preenchidos

---

## 🆘 TROUBLESHOOTING

### Erro: "Não é possível continuar o pagamento com este cartão"

**Possíveis causas:**

1. ❌ **Nome não é APRO (maiúsculo)**
   - Solução: Digite exatamente `APRO` (4 letras, maiúsculas)

2. ❌ **Validade errada** (digitou 11/25 em vez de 11/30)
   - Solução: Use `11/30`

3. ❌ **Campo vazio**
   - Solução: Preencha TODOS os campos

4. ❌ **CPF inválido**
   - Solução: Use `12345678909`

5. ❌ **CVV errado**
   - Solução: Use `123` (3 dígitos para Mastercard/Visa)

### Erro: Não redireciona para sandbox

**Possíveis causas:**

1. ❌ **Variáveis de ambiente erradas**
   - Solução: Verifique no Vercel se tem as 3 variáveis corretas

2. ❌ **Deploy não foi aplicado**
   - Solução: Faça redeploy manual no Vercel

### Erro: Página ainda mostra "14 dias"

**Causa:** Cache do navegador

**Solução:**
1. Feche TODOS os navegadores
2. Abra novamente
3. Vá para a página
4. **Ctrl + Shift + R**
5. Se ainda não funcionar, faça redeploy no Vercel

---

## 📸 SE PRECISAR DE AJUDA

Tire screenshots de:

1. **Formulário preenchido** (pode cobrir e-mail se quiser)
2. **Erro que aparece** (mensagem completa)
3. **URL da página** (confirmar se é sandbox)
4. **Console do navegador** (F12 → Console → copiar erros)

---

## ✅ RESUMO ULTRA-RÁPIDO

```
1. Ctrl + Shift + R
2. Ir para pricing → Starter → Mensal → Pagar
3. Confirmar que URL tem "sandbox"
4. Preencher formulário EXATO
5. Nome: APRO (maiúsculo!)
6. Validade: 11/30 (não 11/25!)
7. CPF: 12345678909
8. Pagar
9. Deve aprovar ✅
```

---

## 🎯 POR QUE PODE ESTAR DANDO ERRO

Com base na documentação do Mercado Pago, o erro **"Não é possível continuar o pagamento com este cartão"** acontece quando:

1. **Nome do titular não é um dos códigos de teste válidos**
   - No modo sandbox, o nome DEVE ser um dos códigos: APRO, OTHE, CONT, etc.
   - Se você digitar qualquer outro nome (ex: "João Silva"), vai dar erro!

2. **Dados do cartão inconsistentes**
   - Validade inválida (use 11/30)
   - CVV errado (use 123)
   - CPF inválido (use 12345678909)

3. **Formulário incompleto**
   - Algum campo obrigatório está vazio

---

**TESTE AGORA COM ESSES DADOS CORRETOS!** 🚀

A validade correta é **11/30**, não 11/25. Isso pode ser o problema!
