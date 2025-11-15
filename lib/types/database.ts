/**
 * Database Types - Supabase Schema
 */

export type SubscriptionTier = 'starter' | 'professional' | 'enterprise' | 'lifetime';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'expired';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  payment_method?: string;
  payment_id?: string;
  trial_start?: string;
  trial_end?: string;
  current_period_start: string;
  current_period_end: string;
  canceled_at?: string;
  max_quotes?: number; // null = unlimited
  max_clients?: number; // null = unlimited
  max_companies: number;
  created_at: string;
  updated_at: string;
}

export interface UsageMetrics {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  quotes_generated: number;
  clients_created: number;
  companies_created: number;
  created_at: string;
  updated_at: string;
}

export interface QuoteHistory {
  id: string;
  user_id: string;
  quote_data: any; // JSON
  client_name?: string;
  client_id?: string;
  total_amount?: number;
  quote_number?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  external_id?: string;
  payment_url?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionAccess {
  tier: SubscriptionTier | 'free';
  status: SubscriptionStatus | 'none';
  max_quotes?: number;
  max_clients?: number;
  max_companies: number;
  current_quotes?: number;
  current_clients?: number;
  current_companies?: number;
  has_history: boolean;
  has_dashboard: boolean;
  is_white_label: boolean;
  period_end?: string;
}

export interface TierConfig {
  name: string;
  tier: SubscriptionTier;
  price_monthly: number;
  price_yearly: number;
  max_quotes?: number; // undefined = unlimited
  max_clients?: number; // undefined = unlimited
  max_companies: number;
  features: {
    pdf_generation: boolean;
    quote_history: boolean;
    dashboard: boolean;
    data_export: boolean;
    white_label: boolean;
    priority_support: boolean;
    api_access: boolean;
  };
}

export const TIER_CONFIGS: Record<SubscriptionTier, TierConfig> = {
  starter: {
    name: 'Starter',
    tier: 'starter',
    price_monthly: 19.90,
    price_yearly: 199.00, // ~R$ 16,58/mês - 16% de desconto
    max_quotes: 50,
    max_clients: 20,
    max_companies: 1,
    features: {
      pdf_generation: true,
      quote_history: false,
      dashboard: false,
      data_export: false,
      white_label: false,
      priority_support: false,
      api_access: false,
    },
  },
  professional: {
    name: 'Professional',
    tier: 'professional',
    price_monthly: 49.90,
    price_yearly: 499.00, // ~R$ 41,58/mês - 16% de desconto
    max_quotes: undefined, // unlimited
    max_clients: undefined, // unlimited
    max_companies: 3,
    features: {
      pdf_generation: true,
      quote_history: true,
      dashboard: true,
      data_export: true,
      white_label: false,
      priority_support: true,
      api_access: false,
    },
  },
  enterprise: {
    name: 'Enterprise',
    tier: 'enterprise',
    price_monthly: 99.90,
    price_yearly: 999.00, // ~R$ 83,25/mês - 16% de desconto
    max_quotes: undefined, // unlimited
    max_clients: undefined, // unlimited
    max_companies: 999, // effectively unlimited
    features: {
      pdf_generation: true,
      quote_history: true,
      dashboard: true,
      data_export: true,
      white_label: true,
      priority_support: true,
      api_access: true,
    },
  },
  lifetime: {
    name: 'Lifetime',
    tier: 'lifetime',
    price_monthly: 0, // one-time payment
    price_yearly: 1497.00, // pagamento único vitalício
    max_quotes: undefined, // unlimited
    max_clients: undefined, // unlimited
    max_companies: 999, // effectively unlimited
    features: {
      pdf_generation: true,
      quote_history: true,
      dashboard: true,
      data_export: true,
      white_label: true,
      priority_support: true,
      api_access: true,
    },
  },
};
