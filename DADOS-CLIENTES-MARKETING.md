# Coleta de Dados de Clientes para Marketing

## 🎯 Objetivo

Coletar dados adicionais dos clientes para:
- Segmentação de marketing
- Personalização de ofertas
- Análise demográfica
- Campanhas direcionadas

## 📊 Dados Sugeridos para Coletar

### Dados Básicos (Já temos)
- ✅ Nome completo
- ✅ Email
- ✅ Telefone (podemos adicionar)

### Dados Demográficos
- 📅 **Data de Nascimento** (calcular idade)
- 📍 **CEP** (localização para frete)
- 🏙️ **Cidade/Estado** (análise regional)
- 🏢 **Tipo de Cliente** (Pessoa Física / Jurídica)

### Dados Profissionais (Para B2B)
- 🏭 **Segmento de Atuação** (Educação, Engenharia, Hobby, etc)
- 👥 **Tamanho da Empresa** (1-10, 11-50, 51-200, 200+)
- 💼 **Cargo/Função**

### Dados de Interesse
- 🎨 **Tipo de Impressão** (Protótipos, Produtos Finais, Arte, etc)
- 📈 **Volume Mensal Estimado** (Baixo, Médio, Alto)
- 🔍 **Como Conheceu** (Google, Indicação, Instagram, etc)

## 🎨 Como Implementar

### Opção 1: Campos Opcionais no Cadastro (RECOMENDADO)

Adicionar campos opcionais que NÃO bloqueiam o cadastro:

```typescript
// app/auth/signup/page.tsx

const [userData, setUserData] = useState({
  fullName: '',
  email: '',
  password: '',
  // Novos campos opcionais
  phone: '',
  birthdate: '',
  city: '',
  state: '',
  customerType: 'individual', // ou 'business'
  segment: '',
  howDidYouKnow: '',
});
```

**Vantagens:**
- ✅ Usuário pode pular se quiser
- ✅ Não assusta no primeiro contato
- ✅ Coleta gradual de dados

**Desvantagens:**
- ❌ Muitos podem não preencher
- ❌ Dados incompletos

### Opção 2: Modal de "Complete seu Perfil" (MELHOR UX)

Após cadastro, mostrar modal:

```
┌─────────────────────────────────────┐
│  🎉 Conta criada com sucesso!       │
│                                     │
│  Complete seu perfil e ganhe       │
│  +2 orçamentos grátis!              │
│                                     │
│  [Telefone]                         │
│  [Data Nascimento]                  │
│  [CEP]                              │
│                                     │
│  [Completar Agora] [Pular]          │
└─────────────────────────────────────┘
```

**Vantagens:**
- ✅ Não atrapalha cadastro inicial
- ✅ Gamificação (incentivo extra)
- ✅ Pode ser feito depois
- ✅ Taxa de conversão melhor

### Opção 3: Onboarding Wizard (MAIS SOFISTICADO)

Cadastro em etapas:

```
Etapa 1: Dados de Acesso
→ Email, Senha

Etapa 2: Dados Pessoais
→ Nome, Telefone, Data Nascimento

Etapa 3: Dados Profissionais (Opcional)
→ Empresa, Segmento, Cargo

Etapa 4: Interesses
→ Tipo de impressão, Volume, Como conheceu
```

**Vantagens:**
- ✅ Organizado
- ✅ Parece menos "pesado"
- ✅ Pode pular etapas opcionais

**Desvantagens:**
- ❌ Mais complexo de implementar
- ❌ Pode aumentar desistência

## 📱 Sugestão de Implementação SIMPLES

### Passo 1: Adicionar Campos Opcionais no Signup

```typescript
// Adicionar ao formulário de cadastro

<div className="grid grid-cols-2 gap-4">
  <div>
    <label>Telefone (Opcional)</label>
    <input
      type="tel"
      placeholder="(11) 98765-4321"
      className="..."
    />
  </div>

  <div>
    <label>Data de Nascimento (Opcional)</label>
    <input
      type="date"
      className="..."
    />
  </div>
</div>

<div>
  <label>Como conheceu o Precifica3D? (Opcional)</label>
  <select className="...">
    <option value="">Selecione...</option>
    <option value="google">Google</option>
    <option value="instagram">Instagram</option>
    <option value="facebook">Facebook</option>
    <option value="youtube">YouTube</option>
    <option value="indicacao">Indicação</option>
    <option value="outro">Outro</option>
  </select>
</div>
```

### Passo 2: Atualizar Tabela Profiles

```sql
-- Executar no SQL Editor do Supabase

ALTER TABLE profiles ADD COLUMN phone text;
ALTER TABLE profiles ADD COLUMN birthdate date;
ALTER TABLE profiles ADD COLUMN city text;
ALTER TABLE profiles ADD COLUMN state text;
ALTER TABLE profiles ADD COLUMN customer_type text DEFAULT 'individual';
ALTER TABLE profiles ADD COLUMN business_segment text;
ALTER TABLE profiles ADD COLUMN monthly_volume text;
ALTER TABLE profiles ADD COLUMN how_did_you_know text;
ALTER TABLE profiles ADD COLUMN created_at timestamptz DEFAULT now();
```

### Passo 3: Salvar no Signup

```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: fullName,
      phone: userData.phone, // Novo
      birthdate: userData.birthdate, // Novo
      how_did_you_know: userData.howDidYouKnow, // Novo
    },
  },
});
```

## 🔒 LGPD - Lei Geral de Proteção de Dados

### ⚠️ IMPORTANTE: Compliance com LGPD

1. **Consentimento Explícito**
   - Adicionar checkbox:
   ```
   [ ] Concordo em compartilhar meus dados para
       receber ofertas personalizadas e novidades
   ```

2. **Política de Privacidade**
   - Criar página `/politica-privacidade`
   - Explicar como dados serão usados
   - Link no rodapé e no cadastro

3. **Direito de Exclusão**
   - Permitir usuário deletar conta
   - Deletar TODOS os dados (GDPR/LGPD)

4. **Transparência**
   - Mostrar quais dados são obrigatórios
   - Explicar POR QUE está coletando cada dado

### Exemplo de Texto LGPD-Friendly:

```
Por que pedimos seu telefone?
Para enviar notificações sobre seus orçamentos
e suporte mais rápido via WhatsApp.

Por que pedimos sua data de nascimento?
Para enviar ofertas especiais no seu aniversário! 🎉

Seus dados são protegidos e NUNCA vendidos a terceiros.
```

## 📈 Análises Que Você Pode Fazer

Com esses dados, você pode:

### 1. Segmentação por Idade
```sql
-- Clientes jovens (18-30)
SELECT * FROM profiles
WHERE EXTRACT(YEAR FROM AGE(birthdate)) BETWEEN 18 AND 30;

-- Enviar campanha de produtos "modernos"
```

### 2. Análise Regional
```sql
-- Clientes por estado
SELECT state, COUNT(*) as total
FROM profiles
GROUP BY state
ORDER BY total DESC;

-- Focar marketing nos estados com mais clientes
```

### 3. Fonte de Tráfego
```sql
-- De onde vem os clientes?
SELECT how_did_you_know, COUNT(*) as total
FROM profiles
GROUP BY how_did_you_know
ORDER BY total DESC;

-- Investir mais no canal que traz mais clientes
```

### 4. Segmentação B2B vs B2C
```sql
-- Empresas vs Pessoas Físicas
SELECT customer_type, COUNT(*) as total
FROM profiles
GROUP BY customer_type;

-- Criar ofertas específicas para cada tipo
```

## 💰 Estratégias de Marketing com Esses Dados

### 1. Email Marketing Segmentado
- **Aniversariantes do mês:** Cupom de 10% de desconto
- **Novos usuários (7 dias):** Tutorial de como usar
- **Inativos (30 dias):** "Sentimos sua falta! Volte e ganhe..."

### 2. Remarketing por Região
- Facebook Ads para cidades específicas
- Google Ads com geo-targeting

### 3. Personalização
- "Olá [Nome], veja ofertas para [Segmento]"
- "Projetos populares em [Cidade]"

### 4. Upsell Inteligente
- Cliente B2B + Alto volume → Oferecer plano Enterprise
- Cliente Hobby + Baixo volume → Manter no Free/Básico

## 🎯 Recomendação Final

**Para começar (MVP):**
1. Adicione apenas **3 campos opcionais**:
   - 📱 Telefone
   - 📍 Cidade/Estado
   - 🔍 Como conheceu

2. Adicione **checkbox de consentimento** (LGPD)

3. Adicione **link para política de privacidade**

4. Após 1 mês, analise:
   - Quantos % preencheram
   - Quais campos são mais preenchidos
   - Se vale a pena pedir mais dados

**Depois de validar:**
- Adicione mais campos se necessário
- Crie modal de "Complete seu Perfil"
- Implemente gamificação (bônus por preencher)

## 📝 Próximos Passos

Quer que eu implemente:
- [ ] Campos opcionais no cadastro?
- [ ] Modal de "Complete seu Perfil"?
- [ ] Página de Política de Privacidade?
- [ ] Dashboard de analytics dos dados coletados?

Me avise e eu implemento! 🚀
