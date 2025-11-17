'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface SubscriptionData {
  tier: 'free' | 'test' | 'starter' | 'professional' | 'enterprise' | 'lifetime';
  status: 'active' | 'cancelled' | 'expired' | 'trialing';
  current: number;
  max: number | null;
  remaining: number | null;
  is_unlimited: boolean;
  allowed: boolean;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // Chamar função do Supabase que verifica limite
    const { data, error } = await supabase.rpc('check_quote_limit', {
      p_user_id: user.id
    });

    if (error) {
      console.error('Erro ao verificar limite:', error);
      setLoading(false);
      return;
    }

    setSubscription(data);
    setLoading(false);
  };

  const refresh = () => {
    checkSubscription();
  };

  return { subscription, loading, refresh };
}
