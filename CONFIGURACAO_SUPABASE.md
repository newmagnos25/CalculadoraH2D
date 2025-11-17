# Configuração do Supabase - Email de Confirmação

## Problema: Links de confirmação com localhost ou expirados

Se os links de confirmação de email estão vindo com `localhost:3000` ou expirando, siga estes passos:

## 1. Configurar URLs no Painel do Supabase

Acesse: https://supabase.com/dashboard/project/SEU_PROJETO_ID/auth/url-configuration

### Site URL
Configure a URL principal da aplicação:
```
https://seu-dominio.vercel.app
```
ou
```
https://seu-dominio-personalizado.com
```

### Redirect URLs
Adicione TODAS estas URLs (uma por linha):

```
https://seu-dominio.vercel.app/auth/callback
https://seu-dominio.vercel.app/*
https://seu-dominio-personalizado.com/auth/callback
https://seu-dominio-personalizado.com/*
http://localhost:3000/auth/callback
http://localhost:3000/*
```

**Importante**: Substitua pelos seus domínios reais!

## 2. Configurar Variáveis de Ambiente no Vercel

No painel do Vercel (Settings → Environment Variables), adicione:

```
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

**IMPORTANTE**: Use HTTPS, não HTTP!

## 3. Verificar Email Templates

Acesse: https://supabase.com/dashboard/project/SEU_PROJETO_ID/auth/templates

Certifique-se que o template de "Confirm signup" contém:

```html
<h2>Confirme seu cadastro</h2>
<p>Clique no link abaixo para confirmar seu email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar Email</a></p>
```

O importante é que use `{{ .ConfirmationURL }}` e não uma URL fixa.

## 4. Configurações de Sessão (Opcional mas Recomendado)

Em: https://supabase.com/dashboard/project/SEU_PROJETO_ID/auth/policies

Configure:
- **JWT Expiry**: 3600 (1 hora)
- **Refresh Token Rotation**: Habilitado
- **Session Token Refresh**: Automático

## 5. Reenviar Email de Confirmação

Se um usuário recebeu link expirado:

1. Acesse a página de login
2. Tente fazer login com email e senha
3. Se o email não foi confirmado, aparecerá um botão "Reenviar Email de Confirmação"
4. Clique no botão para receber um novo email

## 6. Desativar Confirmação de Email (APENAS para desenvolvimento)

**ATENÇÃO**: Não recomendado para produção!

Em: https://supabase.com/dashboard/project/SEU_PROJETO_ID/auth/providers

Na seção "Email", você pode desabilitar "Enable email confirmations"

## 7. Verificar Logs

Se continuar com problemas, verifique os logs em:
- Supabase: https://supabase.com/dashboard/project/SEU_PROJETO_ID/logs/edge-logs
- Vercel: https://vercel.com/seu-time/seu-projeto/logs

## 8. Testar

Após configurar:

1. Limpe o cache do navegador
2. Crie uma nova conta de teste
3. Verifique se o email chega com a URL correta
4. Clique no link dentro de 1 hora
5. Verifique se redireciona para `/calculator` com sucesso

## Problemas Comuns

### Link expira muito rápido
- Configure "Token Expiry" em Auth → URL Configuration para 3600 segundos ou mais

### Email não chega
- Verifique spam
- Verifique se o email do remetente não está bloqueado
- Configure SMTP customizado se necessário (Auth → SMTP Settings)

### Erro 403 no callback
- Verifique se a URL está nas Redirect URLs permitidas
- Certifique-se que NEXT_PUBLIC_APP_URL está correto no Vercel

### Continua vindo localhost
- Limpe as variáveis de ambiente antigas
- Faça redeploy no Vercel após adicionar NEXT_PUBLIC_APP_URL
- Verifique se não há `.env.local` com valores antigos sendo usado em produção
