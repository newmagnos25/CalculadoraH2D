# 🚀 Como Configurar o Supabase (GRATUITO)

## Passo 1: Criar Conta no Supabase

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub (recomendado) ou Email
4. É **100% GRATUITO** até 500MB de database e 50.000 usuários ativos/mês

## Passo 2: Criar Novo Projeto

1. No dashboard, clique em "New Project"
2. Escolha a organização (ou crie uma nova)
3. Preencha:
   - **Name**: CalculadoraH2D
   - **Database Password**: escolha uma senha forte (anote ela!)
   - **Region**: South America (São Paulo) - mais próximo do Brasil
   - **Pricing Plan**: FREE (grátis)
4. Clique em "Create new project"
5. Aguarde ~2 minutos para o projeto ser criado

## Passo 3: Copiar Credenciais

1. No menu lateral, clique em **Settings** (⚙️)
2. Clique em **API**
3. Você verá duas informações importantes:

### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

### anon/public key
```
eyJhbGci...longo-token-aqui
```

4. Copie essas duas informações

## Passo 4: Adicionar ao Arquivo .env.local

1. Abra o arquivo `.env.local` no seu projeto
2. Você já tem as credenciais lá, mas caso precise atualizar:

```env
NEXT_PUBLIC_SUPABASE_URL=https://sua-url-aqui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

## Passo 5: Executar SQL para Criar Tabelas

1. No Supabase, clique em **SQL Editor** no menu lateral (ícone </> )
2. Clique em "+ New query"
3. Abra o arquivo `supabase-setup.sql` deste projeto
4. **COPIE TODO O CONTEÚDO** do arquivo
5. **COLE** no SQL Editor do Supabase
6. Clique em **RUN** (ou pressione Ctrl+Enter)
7. Você deve ver: "Success. No rows returned"

## Passo 6: Verificar se Funcionou

1. No menu lateral, clique em **Table Editor**
2. Você deve ver as tabelas criadas:
   - profiles
   - subscriptions
   - usage_metrics
   - quotes_history
   - payments

## Passo 7: Configurar Autenticação (Email)

1. No menu lateral, clique em **Authentication** > **Providers**
2. Certifique-se que **Email** está habilitado
3. Em **Email Templates**, você pode personalizar os emails enviados
4. Em **URL Configuration**:
   - **Site URL**: `http://localhost:3000` (desenvolvimento)
   - **Redirect URLs**: adicione `http://localhost:3000/**`

## 🎉 Pronto!

Agora você tem:
- ✅ Banco de dados PostgreSQL gratuito
- ✅ Autenticação configurada
- ✅ Todas as tabelas criadas
- ✅ Row Level Security (RLS) ativado
- ✅ Funções do banco criadas

## Próximos Passos

1. Teste a autenticação criando um usuário
2. Configure os pagamentos (Mercado Pago)
3. Deploy no Vercel

## ⚠️ IMPORTANTE

- **NUNCA** compartilhe sua `Database Password` ou `service_role key`
- A `anon key` é segura para usar no frontend
- Use sempre `.env.local` para credenciais (já está no .gitignore)
