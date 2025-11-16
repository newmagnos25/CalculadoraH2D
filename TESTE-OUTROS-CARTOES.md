# 🧪 TESTE URGENTE - Outros Cartões

## Tente estes cartões NA ORDEM:

### 1️⃣ VISA (tente primeiro):
```
Número: 4235 6477 2802 5682
Nome: APRO
Vencimento: 11/30
CVV: 123
```

### 2️⃣ VISA alternativo:
```
Número: 4509 9535 6623 3704
Nome: APRO
Vencimento: 11/30
CVV: 123
```

### 3️⃣ Mastercard alternativo:
```
Número: 5031 7557 3453 0604
Nome: APRO
Vencimento: 11/30
CVV: 123
```

### 4️⃣ American Express:
```
Número: 3753 651535 56885
Nome: APRO
Vencimento: 11/30
CVV: 1234
```

---

## ⚠️ SE NENHUM FUNCIONAR:

O problema pode ser nas **credenciais TEST** do Mercado Pago.

**Verifique no Vercel:**
1. As variáveis estão EXATAMENTE assim?
```
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY = TEST-b218a451-a978-4171-a66e-9409f0a7b272
MERCADOPAGO_ACCESS_TOKEN = TEST-8204722334915941-111517-5de9b5ddc61d81077701506aa100aab8-2493608388
NEXT_PUBLIC_APP_URL = https://calculadora-h2d.vercel.app
```

2. Tem "TEST-" no início de ambas?
3. O APP_URL está correto?

---

## 🔍 OUTRA POSSIBILIDADE:

O Mercado Pago pode estar rejeitando porque:
- Sua conta de teste nunca foi usada antes
- Precisa ativar algo na conta do Mercado Pago
- As credenciais TEST estão expiradas

**Solução:** Gerar novas credenciais TEST no Mercado Pago.
