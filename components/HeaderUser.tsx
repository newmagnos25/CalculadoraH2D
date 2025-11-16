'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useSubscription } from '@/lib/hooks/useSubscription';

export default function HeaderUser() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { subscription } = useSubscription();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="px-4 py-2 text-orange-500 hover:text-orange-400 font-bold text-sm transition-all"
        >
          Entrar
        </Link>
        <Link
          href="/auth/signup"
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-lg text-sm transition-all shadow-lg"
        >
          Criar Conta
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* User Info */}
      <div className="hidden md:flex flex-col items-end">
        <div className="text-white font-bold text-sm">
          {user.user_metadata?.full_name || user.email?.split('@')[0]}
        </div>
        {subscription && (
          <div className="text-orange-300 text-xs font-semibold">
            Plano {subscription.tier.toUpperCase()}
          </div>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500 text-red-300 hover:text-red-200 font-bold rounded-lg text-sm transition-all"
        title="Sair"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="hidden sm:inline">Sair</span>
      </button>
    </div>
  );
}
