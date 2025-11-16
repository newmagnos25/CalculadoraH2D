'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useSubscription } from '@/lib/hooks/useSubscription';

export default function HeaderUser() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
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

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';
  const userEmail = user.email || '';
  const tierColors: { [key: string]: string } = {
    free: 'bg-slate-500',
    starter: 'bg-blue-500',
    professional: 'bg-purple-500',
    enterprise: 'bg-orange-500',
    lifetime: 'bg-green-500',
  };
  const tierColor = subscription ? tierColors[subscription.tier] || 'bg-slate-500' : 'bg-slate-500';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 hover:bg-slate-800/70 border-2 border-orange-500/50 hover:border-orange-500 rounded-xl transition-all group"
      >
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full ${tierColor} flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform`}>
          {userName.charAt(0).toUpperCase()}
        </div>

        {/* User Info - Hidden on mobile */}
        <div className="hidden md:flex flex-col items-start">
          <div className="text-white font-bold text-sm leading-tight">
            {userName}
          </div>
          {subscription && (
            <div className="text-orange-300 text-xs font-semibold">
              {subscription.tier === 'free' && '🆓 '}
              {subscription.tier === 'starter' && '⭐ '}
              {subscription.tier === 'professional' && '💎 '}
              {subscription.tier === 'enterprise' && '🏢 '}
              {subscription.tier === 'lifetime' && '♾️ '}
              {subscription.tier.toUpperCase()}
            </div>
          )}
        </div>

        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-white transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border-2 border-orange-500 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${tierColor} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm truncate">
                  {userName}
                </div>
                <div className="text-orange-100 text-xs truncate">
                  {userEmail}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          {subscription && (
            <div className="p-4 bg-slate-800/50 border-b border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs font-semibold">Plano Atual:</span>
                <span className={`px-2 py-1 ${tierColor} text-white text-xs font-bold rounded`}>
                  {subscription.tier.toUpperCase()}
                </span>
              </div>
              {!subscription.is_unlimited && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Orçamentos:</span>
                  <span className="text-white text-xs font-bold">
                    {subscription.current} / {subscription.max}
                  </span>
                </div>
              )}
              {subscription.is_unlimited && (
                <div className="text-green-400 text-xs font-bold text-center">
                  ♾️ Orçamentos Ilimitados
                </div>
              )}
            </div>
          )}

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/calculator"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-all group"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold">Calculadora</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-all group"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-semibold">Configurações</span>
            </Link>

            <Link
              href="/pricing"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-all group"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="text-sm font-semibold">Ver Planos</span>
            </Link>

            {subscription && subscription.tier === 'free' && (
              <Link
                href="/upgrade"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 hover:from-orange-500/30 hover:to-amber-500/30 hover:text-orange-200 transition-all group border-y border-orange-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-bold">Fazer Upgrade</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all group"
            >
              <svg className="w-5 h-5 text-red-400 group-hover:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm font-semibold">Sair da Conta</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
