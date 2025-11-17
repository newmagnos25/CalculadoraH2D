import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-2xl border-2 border-orange-500">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
            Termos de Serviço
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Última atualização: Novembro de 2025
          </p>

          <div className="space-y-6 text-slate-700 dark:text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                1. Aceitação dos Termos
              </h2>
              <p>
                Ao acessar e usar o Precifica3D, você concorda com estes termos de serviço.
                Se você não concorda, não use a plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                2. Descrição do Serviço
              </h2>
              <p>
                O Precifica3D é uma ferramenta de precificação para impressão 3D que permite calcular
                custos de impressão, gerar orçamentos e PDFs profissionais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                3. Planos e Pagamentos
              </h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Os planos são cobrados conforme descrito na página de preços</li>
                <li>Pagamentos são processados via Mercado Pago</li>
                <li>Garantia de reembolso de 30 dias</li>
                <li>Você pode cancelar a qualquer momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                4. Uso Aceitável
              </h2>
              <p className="mb-2">Você concorda em NÃO:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Usar a plataforma para fins ilegais</li>
                <li>Tentar hackear ou comprometer a segurança</li>
                <li>Compartilhar sua conta com terceiros</li>
                <li>Fazer engenharia reversa do código</li>
                <li>Usar bots ou automação não autorizada</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                5. Propriedade Intelectual
              </h2>
              <p>
                Todo o código, design e conteúdo do Precifica3D são propriedade da BKreativeLab.
                Você mantém propriedade dos dados que insere na plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                6. Limitação de Responsabilidade
              </h2>
              <p>
                O Precifica3D é fornecido "como está". Não nos responsabilizamos por:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Perdas financeiras decorrentes de cálculos incorretos</li>
                <li>Indisponibilidade temporária do serviço</li>
                <li>Perda de dados (faça backups)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                7. Modificações
              </h2>
              <p>
                Podemos modificar estes termos a qualquer momento. Mudanças significativas serão
                notificadas por email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                8. Cancelamento
              </h2>
              <p>
                Você pode cancelar sua assinatura a qualquer momento nas Configurações.
                Após cancelamento, você mantém acesso até o fim do período pago.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                9. Contato
              </h2>
              <p>
                Para questões sobre os termos:{' '}
                <a href="mailto:suporte@precifica3d.com" className="text-orange-500 hover:underline font-bold">
                  suporte@precifica3d.com
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
