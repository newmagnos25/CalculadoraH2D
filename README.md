# CalculadoraH2D

Calculadora profissional de precificação para impressoras 3D Bambu Lab.

## 🎯 Características

- **Múltiplas Impressoras**: Suporte para H2D, X1C, P1S, A1 e A1 Mini
- **Banco de Filamentos**: E-sun, Filamentos 3D Brasil, 3D Fila, 3D Lab
- **Tarifas de Energia**: Todas as distribuidoras do Brasil por estado
- **Adereços e Inserções**: Sistema completo para parafusos, ímãs, insertos, etc
- **Cálculo Preciso**: Inclui filamento, energia, mão de obra, depreciação e margem de lucro
- **Interface Moderna**: Design responsivo com dark mode

## 🚀 Como Usar

### Desenvolvimento

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Build para Produção

```bash
npm run build
npm start
```

## 📊 Funcionalidades

### Cálculos Inclusos

- ✅ Custo de filamento (por peso)
- ✅ Consumo de energia (por tempo e potência da impressora)
- ✅ Mão de obra
- ✅ Depreciação da máquina
- ✅ Custos fixos (aluguel, internet, etc)
- ✅ Adereços e inserções (parafusos, ímãs, insertos metálicos, etc)
- ✅ Pós-processamento
- ✅ Margem de lucro configurável

### Diferenciais

🌟 **Sistema de Adereços**: Único com banco de dados completo de inserções, parafusos, ímãs e outros componentes

🌟 **Tarifas Regionais**: Valores atualizados de energia para todos os estados do Brasil

🌟 **Impressoras Específicas**: Consumo real de energia de cada modelo Bambu Lab

## 🗂️ Estrutura do Projeto

```
CalculadoraH2D/
├── app/                    # Next.js App Router
├── components/             # Componentes React
├── data/                   # Bancos de dados
│   ├── printers.ts        # Impressoras Bambu Lab
│   ├── filaments.ts       # Filamentos e marcas
│   ├── energy-tariffs.ts  # Tarifas de energia
│   └── addons.ts          # Adereços e inserções
├── lib/                    # Utilitários
│   ├── types.ts           # Tipos TypeScript
│   └── calculator.ts      # Engine de cálculo
└── public/                 # Arquivos estáticos
```

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript
- **Estilização**: TailwindCSS
- **Deploy**: Vercel (recomendado)

## 📈 Roadmap

- [ ] Sistema de autenticação (NextAuth)
- [ ] Salvar cálculos no histórico
- [ ] Exportar relatórios em PDF
- [ ] Importar dados de .gcode/.3mf
- [ ] Perfis de configuração salvos
- [ ] Dashboard de análise de negócio
- [ ] API para integrações

## 💼 Versão Comercial

Planejada para incluir:
- Sistema de usuários e assinaturas
- Planos Free, Pro e Enterprise
- Histórico ilimitado de cálculos
- Relatórios profissionais em PDF
- Suporte prioritário

## 📝 Licença

MIT
