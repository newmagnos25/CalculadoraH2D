/**
 * Google Analytics Event Tracking
 *
 * Usage:
 * import { trackEvent } from '@/lib/analytics';
 * trackEvent('sign_up', { method: 'email' });
 */

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

/**
 * Track a custom event in Google Analytics
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

/**
 * Pre-defined event trackers for common actions
 */
export const analytics = {
  // User authentication events
  signUp: (method: 'email' | 'google' = 'email') => {
    trackEvent('sign_up', { method });
  },

  login: (method: 'email' | 'google' = 'email') => {
    trackEvent('login', { method });
  },

  // Subscription events
  viewPricing: () => {
    trackEvent('view_pricing');
  },

  selectPlan: (tier: string, billingCycle: 'monthly' | 'yearly') => {
    trackEvent('select_plan', { tier, billing_cycle: billingCycle });
  },

  initiateCheckout: (tier: string, value: number) => {
    trackEvent('begin_checkout', {
      tier,
      value,
      currency: 'BRL',
    });
  },

  completePurchase: (tier: string, value: number, transactionId?: string) => {
    trackEvent('purchase', {
      tier,
      value,
      currency: 'BRL',
      transaction_id: transactionId,
    });
  },

  cancelSubscription: (tier: string) => {
    trackEvent('cancel_subscription', { tier });
  },

  // Calculator events
  calculateQuote: (filamentCount: number, hasAddons: boolean) => {
    trackEvent('calculate_quote', {
      filament_count: filamentCount,
      has_addons: hasAddons,
    });
  },

  generatePDF: (tier: string) => {
    trackEvent('generate_pdf', { tier });
  },

  // Client management
  addClient: () => {
    trackEvent('add_client');
  },

  // Settings
  updateCompanyInfo: () => {
    trackEvent('update_company_info');
  },

  addFilament: () => {
    trackEvent('add_filament');
  },

  addPrinter: () => {
    trackEvent('add_printer');
  },

  // Engagement
  viewSettings: () => {
    trackEvent('view_settings');
  },

  viewCalculator: () => {
    trackEvent('view_calculator');
  },

  // Template events (when implemented)
  saveTemplate: () => {
    trackEvent('save_template');
  },

  useTemplate: () => {
    trackEvent('use_template');
  },
};

/**
 * Track page views (automatically handled by GA component)
 * This is for manual tracking if needed
 */
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      page_path: url,
    });
  }
};
