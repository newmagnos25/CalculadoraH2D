-- ============================================
-- SCHEMA DO SUPABASE - CalculadoraH2D PRO
-- ============================================

-- Habilitar extensões necessárias
create extension if not exists "uuid-ossp";

-- ============================================
-- TABELA: profiles
-- Informações adicionais dos usuários
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security)
alter table public.profiles enable row level security;

-- Policies
drop policy if exists "Usuários podem ver seu próprio perfil" on public.profiles;
create policy "Usuários podem ver seu próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Usuários podem atualizar seu próprio perfil" on public.profiles;
create policy "Usuários podem atualizar seu próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================
-- TABELA: subscriptions
-- Assinaturas dos usuários
-- ============================================
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  tier text not null check (tier in ('free', 'starter', 'professional', 'enterprise', 'lifetime')),
  status text not null check (status in ('active', 'cancelled', 'expired', 'trialing')) default 'active',
  billing_cycle text check (billing_cycle in ('monthly', 'yearly', 'lifetime')),
  current_period_start timestamp with time zone default timezone('utc'::text, now()) not null,
  current_period_end timestamp with time zone,
  mercadopago_payment_id text,
  mercadopago_preference_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  unique(user_id)
);

-- RLS
alter table public.subscriptions enable row level security;

-- Policies
drop policy if exists "Usuários podem ver sua própria assinatura" on public.subscriptions;
create policy "Usuários podem ver sua própria assinatura"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ============================================
-- TABELA: quotes
-- Orçamentos criados pelos usuários
-- ============================================
create table if not exists public.quotes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  quote_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar índice para performance
create index if not exists quotes_user_id_idx on public.quotes(user_id);
create index if not exists quotes_created_at_idx on public.quotes(created_at desc);

-- RLS
alter table public.quotes enable row level security;

-- Policies
drop policy if exists "Usuários podem ver seus próprios orçamentos" on public.quotes;
create policy "Usuários podem ver seus próprios orçamentos"
  on public.quotes for select
  using (auth.uid() = user_id);

drop policy if exists "Usuários podem criar orçamentos" on public.quotes;
create policy "Usuários podem criar orçamentos"
  on public.quotes for insert
  with check (auth.uid() = user_id);

drop policy if exists "Usuários podem deletar seus próprios orçamentos" on public.quotes;
create policy "Usuários podem deletar seus próprios orçamentos"
  on public.quotes for delete
  using (auth.uid() = user_id);

-- ============================================
-- TABELA: clients
-- Clientes cadastrados pelos usuários
-- ============================================
create table if not exists public.clients (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  email text,
  phone text,
  document text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices
create index if not exists clients_user_id_idx on public.clients(user_id);

-- RLS
alter table public.clients enable row level security;

-- Policies
drop policy if exists "Usuários podem ver seus próprios clientes" on public.clients;
create policy "Usuários podem ver seus próprios clientes"
  on public.clients for select
  using (auth.uid() = user_id);

drop policy if exists "Usuários podem criar clientes" on public.clients;
create policy "Usuários podem criar clientes"
  on public.clients for insert
  with check (auth.uid() = user_id);

drop policy if exists "Usuários podem atualizar seus próprios clientes" on public.clients;
create policy "Usuários podem atualizar seus próprios clientes"
  on public.clients for update
  using (auth.uid() = user_id);

drop policy if exists "Usuários podem deletar seus próprios clientes" on public.clients;
create policy "Usuários podem deletar seus próprios clientes"
  on public.clients for delete
  using (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Criar perfil automaticamente ao registrar
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');

  -- Criar assinatura FREE automaticamente
  insert into public.subscriptions (user_id, tier, status, billing_cycle, current_period_end)
  values (
    new.id,
    'free',
    'active',
    'monthly',
    timezone('utc'::text, now()) + interval '1 month'
  );

  return new;
end;
$$ language plpgsql security definer;

-- ============================================
-- TRIGGER: Criar perfil ao registrar usuário
-- ============================================
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- FUNCTION: Atualizar updated_at automaticamente
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers para updated_at
drop trigger if exists handle_updated_at on public.profiles;
create trigger handle_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_updated_at on public.subscriptions;
create trigger handle_updated_at
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_updated_at on public.clients;
create trigger handle_updated_at
  before update on public.clients
  for each row execute procedure public.handle_updated_at();

-- ============================================
-- FUNCTION: Verificar limite de orçamentos
-- ============================================
create or replace function public.check_quote_limit(p_user_id uuid)
returns json as $$
declare
  v_tier text;
  v_current_count integer;
  v_max_quotes integer;
  v_period_start timestamp with time zone;
  v_period_end timestamp with time zone;
  v_status text;
begin
  -- Buscar tier e período da assinatura
  select s.tier, s.current_period_start, s.current_period_end, s.status
  into v_tier, v_period_start, v_period_end, v_status
  from public.subscriptions s
  where s.user_id = p_user_id and s.status = 'active';

  -- Se não tem assinatura, retorna erro
  if v_tier is null then
    return json_build_object(
      'allowed', false,
      'reason', 'no_subscription',
      'message', 'Você precisa ter uma assinatura ativa'
    );
  end if;

  -- Definir limites por tier
  case v_tier
    when 'free' then v_max_quotes := 3;
    when 'starter' then v_max_quotes := 50;
    when 'professional' then v_max_quotes := null; -- ilimitado
    when 'enterprise' then v_max_quotes := null; -- ilimitado
    when 'lifetime' then v_max_quotes := null; -- ilimitado
  end case;

  -- Se é ilimitado, permite
  if v_max_quotes is null then
    return json_build_object(
      'allowed', true,
      'tier', v_tier,
      'status', v_status,
      'is_unlimited', true,
      'current_period_end', v_period_end
    );
  end if;

  -- Contar orçamentos no período atual
  select count(*)
  into v_current_count
  from public.quotes
  where user_id = p_user_id
    and created_at >= v_period_start;

  -- Verificar se atingiu o limite
  if v_current_count >= v_max_quotes then
    return json_build_object(
      'allowed', false,
      'reason', 'limit_reached',
      'tier', v_tier,
      'status', v_status,
      'current', v_current_count,
      'max', v_max_quotes,
      'remaining', 0,
      'is_unlimited', false,
      'current_period_end', v_period_end,
      'message', format('Você atingiu o limite de %s orçamentos do plano %s', v_max_quotes, v_tier)
    );
  end if;

  -- Permitido
  return json_build_object(
    'allowed', true,
    'tier', v_tier,
    'status', v_status,
    'current', v_current_count,
    'max', v_max_quotes,
    'remaining', v_max_quotes - v_current_count,
    'is_unlimited', false,
    'current_period_end', v_period_end
  );
end;
$$ language plpgsql security definer;

-- ============================================
-- GRANTS: Dar permissões necessárias
-- ============================================
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all routines in schema public to anon, authenticated;
