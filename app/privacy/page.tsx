import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-2xl border-2 border-orange-500">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
            Política de Privacidade
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Última atualização: Novembro de 2025
          </p>

          <div className="space-y-6 text-slate-700 dark:text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                1. Informações que Coletamos
              </h2>
              <p className="mb-2">Coletamos as seguintes informações:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Nome e email fornecidos no cadastro</li>
                <li>Dados de uso da calculadora (orçamentos gerados)</li>
                <li>Informações de pagamento (processadas via Mercado Pago)</li>
                <li>Cookies para melhorar sua experiência</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                2. Como Usamos Suas Informações
              </h2>
              <p className="mb-2">Utilizamos suas informações para:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Fornecer acesso à plataforma</li>
                <li>Processar pagamentos</li>
                <li>Melhorar nossos serviços</li>
                <li>Enviar atualizações importantes</li>
                <li>Suporte técnico</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                3. Compartilhamento de Dados
              </h2>
              <p>
                Não vendemos seus dados. Compartilhamos apenas com parceiros essenciais:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li><strong>Supabase</strong> - Armazenamento de dados</li>
                <li><strong>Mercado Pago</strong> - Processamento de pagamentos</li>
                <li><strong>Vercel</strong> - Hospedagem da plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                4. Segurança
              </h2>
              <p>
                Utilizamos criptografia SSL e práticas de segurança padrão da indústria para proteger seus dados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                5. Seus Direitos
              </h2>
              <p className="mb-2">Você tem direito a:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Acessar seus dados</li>
                <li>Corrigir informações incorretas</li>
                <li>Solicitar exclusão de sua conta</li>
                <li>Exportar seus dados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                6. Contato
              </h2>
              <p>
                Para questões sobre privacidade, entre em contato:{' '}
                <a href="mailto:privacidade@precifica3d.com" className="text-orange-500 hover:underline font-bold">
                  privacidade@precifica3d.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <Link
              href="/"
              className="text-orange-500 hover:text-orange-400 font-bold"
            >
              ← Voltar para Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
