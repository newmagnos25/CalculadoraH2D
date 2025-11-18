-- Migration: Change test plan limit to weekly (50 per week instead of total)
-- Created: 2025-11-18
-- Description: Updates check_quote_limit to count test plan quotes per week, not total period

create or replace function public.check_quote_limit(p_user_id uuid)
returns json as $$
declare
  v_tier text;
  v_current_count integer;
  v_max_quotes integer;
  v_period_start timestamp with time zone;
  v_period_end timestamp with time zone;
  v_status text;
  v_week_start timestamp with time zone;
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
    when 'free' then v_max_quotes := 5;
    when 'test' then v_max_quotes := 50; -- 50 orçamentos por SEMANA
    when 'starter' then v_max_quotes := 50;
    when 'professional' then v_max_quotes := null; -- ilimitado
    when 'enterprise' then v_max_quotes := null; -- ilimitado
    when 'lifetime' then v_max_quotes := null; -- ilimitado
    else v_max_quotes := 3; -- default para tiers desconhecidos
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

  -- Para plano TESTE, contar por semana (últimos 7 dias)
  -- Para outros planos, contar desde period_start
  if v_tier = 'test' then
    v_week_start := now() - interval '7 days';
    select count(*)
    into v_current_count
    from public.quotes
    where user_id = p_user_id
      and created_at >= v_week_start;
  else
    -- Outros planos contam desde o início do período
    select count(*)
    into v_current_count
    from public.quotes
    where user_id = p_user_id
      and created_at >= v_period_start;
  end if;

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
