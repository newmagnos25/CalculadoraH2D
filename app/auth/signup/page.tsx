'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { validateEmail, validatePassword, EmailValidationResult, PasswordValidationResult } from '@/lib/validation';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'warning' | 'success'>('error');
  const [resendingEmail, setResendingEmail] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [emailValidation, setEmailValidation] = useState<EmailValidationResult | null>(null);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Validação de email em tempo real
  useEffect(() => {
    if (email && emailTouched) {
      const validation = validateEmail(email);
      setEmailValidation(validation);
    } else {
      setEmailValidation(null);
    }
  }, [email, emailTouched]);

  // Validação de senha em tempo real
  useEffect(() => {
    if (password && passwordTouched) {
      const validation = validatePassword(password);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation(null);
    }
  }, [password, passwordTouched]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => setCooldownSeconds(cooldownSeconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  const handleResendConfirmation = async () => {
    if (!email) {
      setMessage('Digite seu email para reenviar a confirmação');
      setMessageType('error');
      return;
    }

    if (cooldownSeconds > 0) {
      return; // Ainda em cooldown
    }

    setResendingEmail(true);

    try {
      const supabase = createClient();
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${appUrl}/auth/callback`,
        }
      });

      if (error) {
        setMessage(`Erro ao reenviar: ${error.message}`);
        setMessageType('error');
      } else {
        setMessage('✅ Email reenviado! Verifique sua caixa de entrada e spam.');
        setMessageType('success');
        setCooldownSeconds(60); // Cooldown de 60 segundos
      }
    } catch (err: any) {
      setMessage('Erro ao reenviar email. Tente novamente em instantes.');
      setMessageType('error');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validar email
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setMessage(emailCheck.error || 'Email inválido');
      setMessageType('error');
      setLoading(false);
      setEmailTouched(true);
      return;
    }

    // Validar senha
    if (password.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres');
      setMessageType('error');
      setLoading(false);
      setPasswordTouched(true);
      return;
    }

    try {
      const supabase = createClient();

      // Verificar se o Supabase está configurado
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        setMessage('Erro de configuração: Supabase não configurado corretamente');
        setMessageType('error');
        setLoading(false);
        return;
      }

      console.log('Tentando criar conta para:', email);

      // Usar NEXT_PUBLIC_APP_URL se disponível, senão usar window.location.origin
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${appUrl}/auth/callback`,
        },
      });

      if (error) {
        console.error('Erro ao criar conta:', error);

        // Tratar erro de email duplicado
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          setMessage('Este email já está cadastrado. Faça login ou use outro email.');
          setMessageType('error');
        } else if (error.message.includes('invalid email')) {
          setMessage('Email inválido. Verifique e tente novamente.');
          setMessageType('error');
        } else {
          setMessage(error.message || 'Erro ao criar conta. Tente novamente.');
          setMessageType('error');
        }

        setLoading(false);
        return;
      }

      console.log('Conta criada com sucesso:', data);

      // Verificar se precisa de confirmação de email
      if (data.user && !data.session) {
        setMessage('Verifique seu email para confirmar a conta antes de fazer login.');
        setMessageType('warning');
        setLoading(false);
        return;
      }

      // Se tudo deu certo, redirecionar
      console.log('Conta criada com sucesso!');

      // Verificar se tem redirect query param ou tier salvo
      const redirectTo = searchParams.get('redirect');
      const savedTier = localStorage.getItem('checkout_tier_intent');

      if (redirectTo) {
        // Redirecionar para onde estava tentando ir
        window.location.href = redirectTo;
      } else if (savedTier) {
        // Redirecionar para checkout do tier salvo
        localStorage.removeItem('checkout_tier_intent');
        window.location.href = `/checkout/${savedTier}`;
      } else {
        // Redirecionar para calculadora
        window.location.href = '/calculator';
      }
    } catch (err: any) {
      console.error('Erro inesperado:', err);
      setMessage(`Erro ao conectar: ${err.message || 'Verifique sua conexão com a internet'}`);
      setMessageType('error');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            Precifica3D PRO
          </h1>
          <p className="text-slate-400">
            Crie sua conta gratuitamente
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border-2 border-orange-500 shadow-2xl">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
            Criar Conta
          </h2>

          {message && (
            <div className={`mb-6 p-4 border-2 rounded-lg ${
              messageType === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                : messageType === 'warning'
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                : 'bg-red-50 dark:bg-red-900/20 border-red-500'
            }`}>
              <p className={`text-sm font-semibold ${
                messageType === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : messageType === 'warning'
                  ? 'text-yellow-800 dark:text-yellow-200'
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {messageType === 'success' ? '✅' : messageType === 'warning' ? '⚠️' : '❌'} {message}
              </p>

              {/* Botão de reenviar email - só aparece se for warning (precisa confirmar) */}
              {messageType === 'warning' && message.includes('Verifique seu email') && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={resendingEmail || cooldownSeconds > 0}
                    className="w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors shadow-md"
                  >
                    {resendingEmail ? (
                      '📧 Reenviando...'
                    ) : cooldownSeconds > 0 ? (
                      `⏱️ Aguarde ${cooldownSeconds}s para reenviar`
                    ) : (
                      '📧 Não recebeu? Reenviar Email'
                    )}
                  </button>
                  <p className="text-xs text-center mt-2 text-yellow-700 dark:text-yellow-300">
                    Verifique também sua pasta de spam/lixo eletrônico
                  </p>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                required
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none transition-colors ${
                  emailValidation && emailTouched
                    ? emailValidation.isValid
                      ? emailValidation.warning
                        ? 'border-yellow-500 focus:border-yellow-600'
                        : 'border-green-500 focus:border-green-600'
                      : 'border-red-500 focus:border-red-600'
                    : 'border-slate-300 dark:border-slate-700 focus:border-orange-500'
                }`}
                placeholder="seu@email.com"
              />
              {emailValidation && emailTouched && (
                <div className="mt-2">
                  {!emailValidation.isValid && emailValidation.error && (
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                      <span>❌</span>
                      <span>{emailValidation.error}</span>
                    </p>
                  )}
                  {emailValidation.isValid && emailValidation.warning && (
                    <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{emailValidation.warning}</span>
                    </p>
                  )}
                  {emailValidation.isValid && !emailValidation.warning && (
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                      <span>✅</span>
                      <span>Email válido!</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                required
                minLength={6}
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none transition-colors ${
                  passwordValidation && passwordTouched
                    ? passwordValidation.isValid
                      ? passwordValidation.strength === 'strong'
                        ? 'border-green-500 focus:border-green-600'
                        : passwordValidation.strength === 'medium'
                        ? 'border-yellow-500 focus:border-yellow-600'
                        : 'border-orange-500 focus:border-orange-600'
                      : 'border-red-500 focus:border-red-600'
                    : 'border-slate-300 dark:border-slate-700 focus:border-orange-500'
                }`}
                placeholder="••••••••"
              />
              {passwordValidation && passwordTouched ? (
                <div className="mt-2">
                  {!passwordValidation.isValid && passwordValidation.error && (
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                      <span>❌</span>
                      <span>{passwordValidation.error}</span>
                    </p>
                  )}
                  {passwordValidation.isValid && passwordValidation.strength && (
                    <div className="space-y-1">
                      <p className={`text-sm font-semibold flex items-center gap-2 ${
                        passwordValidation.strength === 'strong'
                          ? 'text-green-600 dark:text-green-400'
                          : passwordValidation.strength === 'medium'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-orange-600 dark:text-orange-400'
                      }`}>
                        <span>
                          {passwordValidation.strength === 'strong' ? '🔒' :
                           passwordValidation.strength === 'medium' ? '🔓' : '⚠️'}
                        </span>
                        <span>
                          Senha {passwordValidation.strength === 'strong' ? 'forte' :
                                passwordValidation.strength === 'medium' ? 'média' : 'fraca'}
                        </span>
                      </p>
                      {passwordValidation.strength !== 'strong' && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Dica: Use letras maiúsculas, minúsculas, números e caracteres especiais
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Mínimo 6 caracteres
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (emailTouched && emailValidation ? !emailValidation.isValid : false)}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-black py-3 px-6 rounded-lg transition-all shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? 'Criando conta...' : 'Criar Conta Grátis'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Já tem uma conta?{' '}
              <Link href="/auth/login" className="text-orange-500 hover:text-orange-400 font-bold">
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6">
          <h3 className="text-white font-black text-lg mb-3 text-center">
            🎉 Plano FREE Incluído!
          </h3>
          <ul className="space-y-2 text-white text-sm">
            <li className="flex items-center gap-2">
              <span>✅</span>
              <span><strong>5 orçamentos por mês</strong> (renova todo mês)</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✅</span>
              <span>Geração de PDFs profissionais</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✅</span>
              <span>Sem cartão de crédito necessário</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✅</span>
              <span>Faça upgrade quando quiser</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </main>
    }>
      <SignupForm />
    </Suspense>
  );
}
