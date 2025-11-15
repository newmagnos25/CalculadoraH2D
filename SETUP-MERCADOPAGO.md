# 💳 Como Obter Access Token do Mercado Pago (GRATUITO)

## O que é o Mercado Pago?

O Mercado Pago é uma plataforma de pagamentos brasileira que aceita:
- 💳 Cartão de crédito
- 🏦 PIX
- 📄 Boleto bancário
- 💰 Saldo Mercado Pago

## Passo 1: Criar Conta de Desenvolvedor

1. Acesse: https://www.mercadopago.com.br
2. Se não tiver conta, clique em "Criar conta"
3. Preencha seus dados
4. **É GRATUITO** - não precisa pagar nada para começar

## Passo 2: Acessar Área de Desenvolvedores

1. Faça login no Mercado Pago
2. Acesse: https://www.mercadopago.com.br/developers
3. Ou clique no seu perfil > "Seu negócio" > "Configurações" > "Gestão e Administração" > "Credenciais"

## Passo 3: Criar Aplicação

1. No painel de desenvolvedores, vá em **Suas integrações**
2. Clique em **Criar aplicação**
3. Preencha:
   - **Nome da aplicação**: CalculadoraH2D
   - **Descrição**: Sistema de cálculo e orçamento para impressão 3D
   - **Tipo de produto**: Marketplace/Plataforma
4. Clique em **Criar aplicação**

## Passo 4: Obter Credenciais

### Modo de Teste (Para Desenvolvimento)

1. No menu lateral, clique em **Credenciais de teste**
2. Você verá duas chaves:
   - **Public Key** (começa com `TEST-...`)
   - **Access Token** (começa com `TEST-...`)
3. **COPIE o Access Token de TESTE**

### Modo de Produção (Para Receber Pagamentos Reais)

1. No menu lateral, clique em **Credenciais de produção**
2. Você verá:
   - **Public Key** (começa com `APP_USR-...`)
   - **Access Token** (começa com `APP_USR-...`)
3. **COPIE o Access Token de PRODUÇÃO**

## Passo 5: Adicionar ao Arquivo .env.local

Abra o arquivo `.env.local` e adicione:

```env
# Mercado Pago - TESTE (use enquanto desenvolve)
MERCADOPAGO_ACCESS_TOKEN=TEST-seu-token-de-teste-aqui

# Mercado Pago - PRODUÇÃO (use quando for ao ar)
# MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu-token-de-producao-aqui
```

## Passo 6: Configurar Webhook (Notificações de Pagamento)

1. No painel do Mercado Pago, vá em **Webhooks**
2. Clique em **Configurar Webhooks**
3. Adicione a URL:
   - **Desenvolvimento**: `https://seu-dominio.vercel.app/api/webhooks/mercadopago`
   - **Produção**: `https://seu-dominio-real.com/api/webhooks/mercadopago`
4. Selecione os eventos:
   - ✅ payment
   - ✅ plan
   - ✅ subscription
5. Salve

## 💡 Diferença entre Teste e Produção

| Modo | Descrição | Quando Usar |
|------|-----------|-------------|
| **TESTE** | Simula pagamentos, não cobra dinheiro real | Durante desenvolvimento |
| **PRODUÇÃO** | Cobra pagamentos reais de clientes | Quando publicar o site |

## 🧪 Testar Pagamentos (Modo Teste)

Para testar pagamentos no modo teste, use estes cartões:

### Mastercard - Aprovado
```
Número: 5031 4332 1540 6351
CVV: 123
Data: 11/25
Nome: APRO (importante!)
```

### Visa - Recusado
```
Número: 4509 9535 6623 3704
CVV: 123
Data: 11/25
Nome: OTHE (importante!)
```

### PIX - Aprovado
O Mercado Pago gera um QR Code de teste automaticamente

## 📊 Taxas do Mercado Pago (2025)

- **PIX**: ~0,99% por transação
- **Cartão de crédito**: ~4,99% + R$ 0,40 por transação
- **Boleto**: ~R$ 3,49 por transação

## ⚠️ IMPORTANTE

1. **NUNCA** compartilhe seu Access Token em público
2. **NUNCA** commit o Access Token no Git (use .env.local)
3. Use **TESTE** enquanto desenvolve
4. Mude para **PRODUÇÃO** só quando publicar

## 🎉 Pronto!

Agora você tem:
- ✅ Conta no Mercado Pago
- ✅ Aplicação criada
- ✅ Access Token (teste e produção)
- ✅ Webhook configurado

## Próximos Passos

1. Testar pagamento no modo teste
2. Criar página de checkout
3. Implementar webhook handler
