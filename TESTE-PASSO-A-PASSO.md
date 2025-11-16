# 🎯 TESTE COMPLETO - Passo a Passo

## ✅ CONFIRMAÇÃO: Você está no caminho certo!

Se ao clicar em "Pagar" vai para:
```
https://sandbox.mercadopago.com.br/checkout/...
```

**ÓTIMO!** Isso significa que as credenciais TEST estão funcionando! 🎉

---

## 🔧 PROBLEMA 1: Página ainda mostra "14 dias"

### Causa:
- Cache do navegador OU
- Vercel não fez redeploy do novo código

### Solução Rápida:
1. Vá para: https://calculadora-h2d-git-claude-chat-319f5e-brunos-projects-9415a210.vercel.app/pricing
2. Aperte **Ctrl + Shift + R** (força recarregar sem cache)
3. Deve aparecer "7 dias" agora

### Se ainda não funcionar:
1. Entre no Vercel
2. Vá em **Deployments**
3. Clique nos **3 pontinhos** da última deployment
4. Clique em **"Redeploy"**
5. Aguarde 2-3 minutos
6. Teste novamente (Ctrl + Shift + R)

---

## 💳 PROBLEMA 2: Cartão de teste dá erro

### O QUE ESTÁ ACONTECENDO:
Você está indo para o checkout correto (sandbox), mas o cartão precisa ser preenchido EXATAMENTE certo.

### ✅ FORMULÁRIO COMPLETO (preencha EXATO):

Quando abrir o checkout do Mercado Pago:

**1. E-mail (qualquer um):**
```
test_user@testuser.com
```

**2. Número do cartão:**
```
5031 4332 1540 6351
```
(Pode digitar sem espaços: 5031433215406351)

**3. Nome do titular (TEM que ser APRO!):**
```
APRO
```
⚠️ **IMPORTANTE:** O nome define se aprova ou não!
- `APRO` = Aprova ✅
- `PEND` = Fica pendente ⏳
- `OTHE` = Rejeita ❌

**4. Vencimento:**
```
11/30
```

**5. Código de segurança:**
```
123
```

**6. CPF:**
```
12345678909
```

**7. Parcelas:**
```
1x
```

**8. Clique em "Pagar"**

---

## 📸 EXEMPLO VISUAL

```
┌─────────────────────────────────────┐
│ Pagar com cartão                    │
├─────────────────────────────────────┤
│ E-mail                              │
│ test_user@testuser.com              │
│                                     │
│ Número do cartão                    │
│ 5031 4332 1540 6351                 │
│                                     │
│ Nome do titular (IMPORTANTE!)       │
│ APRO                         ← ISSO!│
│                                     │
│ Vencimento      Código              │
│ 11/30           123                 │
│                                     │
│ CPF                                 │
│ 12345678909                         │
│                                     │
│ Parcelas                            │
│ 1x                                  │
│                                     │
│ [ Pagar ]                           │
└─────────────────────────────────────┘
```

---

## 🎯 O QUE DEVE ACONTECER:

### ✅ SE TUDO DER CERTO:

1. Você clica em "Pagar"
2. Aparece: ✅ "Pagamento aprovado!"
3. Redireciona para: `/checkout/success`
4. Mostra mensagem de sucesso

### ❌ SE DER ERRO:

**Erro comum:** "Não é possível continuar o pagamento com este cartão"

**Causas:**
1. Nome NÃO é `APRO` (tem que ser maiúscula)
2. Algum campo está vazio
3. CPF inválido (use 12345678909)

---

## 🔍 CHECKLIST ANTES DE TESTAR:

- [ ] Fez Ctrl + Shift + R na página de pricing
- [ ] Agora aparece "7 dias" (não 14)
- [ ] Clicou em "Começar Agora" no Starter
- [ ] Foi para sandbox.mercadopago.com.br (✅ correto!)
- [ ] Preencheu email
- [ ] Número do cartão: 5031 4332 1540 6351
- [ ] Nome: **APRO** (maiúscula)
- [ ] Validade: 11/30
- [ ] CVV: 123
- [ ] CPF: 12345678909
- [ ] Clicou em "Pagar"

---

## 🆘 SE AINDA NÃO FUNCIONAR:

**Tire screenshot de:**
1. Formulário preenchido (pode tampar email)
2. Erro que aparece
3. Environment Variables do Vercel (pode tampar valores)

**E me manda aqui que eu vejo o que tá errado!**

---

## 🎁 DICA EXTRA: Outros Cartões de Teste

Se quiser testar outros cenários:

### Cartão VISA:
```
Número: 4235 6477 2802 5682
Nome: APRO
CVV: 123
Validade: 11/30
CPF: 12345678909
```

### Cartão MASTERCARD:
```
Número: 5031 4332 1540 6351
Nome: APRO
CVV: 123
Validade: 11/30
CPF: 12345678909
```

### American Express:
```
Número: 3753 651535 56885
Nome: APRO
CVV: 1234 (4 dígitos)
Validade: 11/30
CPF: 12345678909
```

---

## ✅ RESUMO:

1. **Ctrl + Shift + R** na página
2. Preencher formulário **EXATAMENTE** como acima
3. Nome do titular: **APRO** (isso é crucial!)
4. Deve aprovar ✅

**BOA SORTE! Me fala se funcionou!** 🚀
