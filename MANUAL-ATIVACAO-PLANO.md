# Manual: Ativar Plano Manualmente

## 🚨 Situação

Pagamento foi aprovado mas o plano não foi ativado automaticamente.

## ✅ Solução: Ativar Manualmente

### 1. Via cURL (Terminal)

```bash
curl -X POST https://precifica3d.vercel.app/api/admin/activate-subscription \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-secret-2024" \
  -d '{
    "user_email": "email-da-sua-esposa@gmail.com",
    "tier": "test",
    "days": 7
  }'
```

### 2. Via Postman/Insomnia

**URL:** `POST https://precifica3d.vercel.app/api/admin/activate-subscription`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer admin-secret-2024
```

**Body (JSON):**
```json
{
  "user_email": "email-da-sua-esposa@gmail.com",
  "tier": "test",
  "days": 7
}
```

### 3. Via Código JavaScript

```javascript
const response = await fetch('https://precifica3d.vercel.app/api/admin/activate-subscription', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer admin-secret-2024'
  },
  body: JSON.stringify({
    user_email: 'email-da-sua-esposa@gmail.com',
    tier: 'test',
    days: 7
  })
});

const result = await response.json();
console.log(result);
```

## 📊 Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `user_email` | string | ✅ Sim | Email do usuário |
| `tier` | string | ✅ Sim | Plano: `test`, `starter`, `professional`, `enterprise`, `lifetime` |
| `days` | number | ❌ Não | Dias de acesso (default: depende do tier) |

## 🎯 Exemplos de Uso

### Ativar plano teste (R$ 2,90) por 7 dias
```json
{
  "user_email": "cliente@email.com",
  "tier": "test",
  "days": 7
}
```

### Ativar plano Starter por 30 dias
```json
{
  "user_email": "cliente@email.com",
  "tier": "starter",
  "days": 30
}
```

### Ativar plano Professional por 1 ano
```json
{
  "user_email": "cliente@email.com",
  "tier": "professional",
  "days": 365
}
```

### Ativar plano Lifetime (vitalício)
```json
{
  "user_email": "cliente@email.com",
  "tier": "lifetime"
}
```

## 🔒 Segurança

**IMPORTANTE:** Em produção, altere a senha admin no `.env`:

```env
ADMIN_SECRET=sua-senha-super-secreta-aqui
```

E use essa senha no header `Authorization: Bearer sua-senha-super-secreta-aqui`

## ✅ Resposta de Sucesso

```json
{
  "success": true,
  "message": "Assinatura ativada com sucesso",
  "data": {
    "user_id": "uuid-do-usuario",
    "email": "cliente@email.com",
    "tier": "test",
    "status": "active",
    "period_end": "2025-11-24T12:00:00.000Z"
  }
}
```

## ❌ Erros Comuns

### Usuário não encontrado
```json
{
  "error": "Usuário com email cliente@email.com não encontrado"
}
```
**Solução:** Verifique se o email está correto e se o usuário criou conta.

### Não autorizado
```json
{
  "error": "Não autorizado"
}
```
**Solução:** Verifique se está usando o header `Authorization` correto.

## 📝 Logs

Após ativar, você pode verificar no dashboard do Supabase:
1. Vá em **Table Editor** → **subscriptions**
2. Procure pelo email do usuário
3. Verifique se `status = 'active'` e `tier` está correto
