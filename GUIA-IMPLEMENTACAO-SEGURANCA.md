# 🚀 Guia de Implementação - Segurança e Inventário

## ✅ ETAPA 1: EXECUTAR MIGRATION NO SUPABASE

### 1.1 Acessar o Supabase Dashboard
```
https://app.supabase.com/project/SEU_PROJECT_ID/sql/new
```

### 1.2 Executar Migration
1. Abra o arquivo: `supabase/migrations/002_inventory_and_security.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **RUN**

### 1.3 Verificar se funcionou
```sql
-- Deve retornar as novas tabelas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'custom_filaments',
    'custom_addons',
    'custom_printers',
    'company_settings',
    'inventory_movements',
    'signup_attempts'
  );
```

---

## ✅ ETAPA 2: MIGRAR DADOS DO LOCALSTORAGE PARA SUPABASE

### 2.1 Criar Script de Migração

Arquivo: `scripts/migrate-to-supabase.ts`

```typescript
import { createClient } from '@/lib/supabase/client';

export async function migrateLocalStorageToSupabase() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  try {
    // 1. Migrar Filamentos Customizados
    const localFilaments = JSON.parse(localStorage.getItem('bkl_custom_filaments') || '[]');
    if (localFilaments.length > 0) {
      const { error } = await supabase
        .from('custom_filaments')
        .insert(localFilaments.map((f: any) => ({
          user_id: user.id,
          brand: f.brand,
          type: f.type,
          color: f.color,
          price_per_kg: f.pricePerKg,
        })));

      if (error) console.error('Erro ao migrar filamentos:', error);
      else console.log('✅ Filamentos migrados');
    }

    // 2. Migrar Adereços Customizados
    const localAddons = JSON.parse(localStorage.getItem('bkl_custom_addons') || '[]');
    if (localAddons.length > 0) {
      const { error } = await supabase
        .from('custom_addons')
        .insert(localAddons.map((a: any) => ({
          user_id: user.id,
          name: a.name,
          category: a.category,
          price_per_unit: a.pricePerUnit,
          unit: a.unit,
        })));

      if (error) console.error('Erro ao migrar adereços:', error);
      else console.log('✅ Adereços migrados');
    }

    // 3. Migrar Impressoras Customizadas
    const localPrinters = JSON.parse(localStorage.getItem('bkl_custom_printers') || '[]');
    if (localPrinters.length > 0) {
      const { error } = await supabase
        .from('custom_printers')
        .insert(localPrinters.map((p: any) => ({
          user_id: user.id,
          name: p.name,
          brand: p.brand,
          model: p.model,
          power_consumption_watts: p.powerConsumption,
        })));

      if (error) console.error('Erro ao migrar impressoras:', error);
      else console.log('✅ Impressoras migradas');
    }

    // 4. Migrar Configurações da Empresa
    const localCompany = JSON.parse(localStorage.getItem('bkl_company_settings') || 'null');
    if (localCompany) {
      const { error } = await supabase
        .from('company_settings')
        .insert({
          user_id: user.id,
          name: localCompany.name,
          trade_name: localCompany.tradeName,
          cnpj: localCompany.cnpj,
          address: localCompany.address,
          city: localCompany.city,
          state: localCompany.state,
          zip_code: localCompany.zipCode,
          phone: localCompany.phone,
          email: localCompany.email,
          invoice_prefix: localCompany.invoicePrefix,
          invoice_counter: localCompany.invoiceCounter,
          payment_terms: localCompany.paymentTerms,
          bank_details: localCompany.bankDetails,
        });

      if (error) console.error('Erro ao migrar empresa:', error);
      else console.log('✅ Empresa migrada');
    }

    console.log('🎉 Migração concluída!');
    return true;
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    return false;
  }
}
```

### 2.2 Adicionar Botão de Migração

Temporariamente, adicione em `/app/settings/page.tsx`:

```typescript
import { migrateLocalStorageToSupabase } from '@/scripts/migrate-to-supabase';

// Dentro do componente:
const [migrating, setMigrating] = useState(false);

const handleMigrate = async () => {
  setMigrating(true);
  const success = await migrateLocalStorageToSupabase();
  if (success) {
    alert('Dados migrados com sucesso!');
    // Limpar localStorage (opcional)
    // localStorage.clear();
  }
  setMigrating(false);
};

// No JSX:
<button onClick={handleMigrate} disabled={migrating}>
  {migrating ? 'Migrando...' : 'Migrar Dados para Nuvem'}
</button>
```

---

## ✅ ETAPA 3: ATUALIZAR LIB/STORAGE.TS

Substituir TODAS as funções para usar Supabase:

```typescript
// lib/storage.ts
import { createClient } from '@/lib/supabase/client';

// Filamentos customizados
export async function getCustomFilaments(): Promise<Filament[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('custom_filaments')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (error) {
    console.error('Erro ao buscar filamentos:', error);
    return [];
  }

  return data.map(f => ({
    id: f.id,
    brand: f.brand,
    type: f.type,
    color: f.color,
    pricePerKg: parseFloat(f.price_per_kg),
  }));
}

export async function saveCustomFilament(filament: Filament): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('custom_filaments')
    .upsert({
      id: filament.id,
      user_id: user.id,
      brand: filament.brand,
      type: filament.type,
      color: filament.color,
      price_per_kg: filament.pricePerKg,
    });

  return !error;
}

// Repetir para: Addons, Printers, Company Settings, etc
```

---

## ✅ ETAPA 4: IMPLEMENTAR PROTEÇÃO CONTRA ABUSO

### 4.1 Instalar Dependências

```bash
npm install react-google-recaptcha-v3 @fingerprintjs/fingerprintjs
```

### 4.2 Configurar reCAPTCHA

1. Criar projeto em: https://www.google.com/recaptcha/admin/create
2. Escolher **reCAPTCHA v3**
3. Adicionar domínio (localhost + produção)
4. Copiar **Site Key** e **Secret Key**

### 4.3 Adicionar ao `.env.local`

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=sua_site_key_aqui
RECAPTCHA_SECRET_KEY=sua_secret_key_aqui
```

### 4.4 Atualizar `app/auth/signup/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function SignupPage() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Obter device fingerprint
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const deviceFingerprint = result.visitorId;

    // 2. Executar reCAPTCHA
    if (!executeRecaptcha) {
      setError('Erro ao verificar segurança');
      setLoading(false);
      return;
    }

    const recaptchaToken = await executeRecaptcha('signup');

    // 3. Verificar rate limit
    const ipAddress = await fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(d => d.ip);

    const { data: rateLimitCheck, error: rateLimitError } = await supabase
      .rpc('check_signup_rate_limit', {
        p_ip_address: ipAddress,
        p_email: email,
        p_device_fingerprint: deviceFingerprint,
      });

    if (rateLimitError || !rateLimitCheck.allowed) {
      setError(rateLimitCheck.message || 'Muitas tentativas. Tente novamente mais tarde.');
      setLoading(false);
      return;
    }

    // 4. Verificar reCAPTCHA no backend
    const recaptchaValid = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: recaptchaToken }),
    }).then(r => r.json());

    if (!recaptchaValid.success || recaptchaValid.score < 0.5) {
      setError('Verificação de segurança falhou. Você é um robô?');
      setLoading(false);
      return;
    }

    // 5. Registrar tentativa
    await supabase.rpc('register_signup_attempt', {
      p_ip_address: ipAddress,
      p_email: email,
      p_device_fingerprint: deviceFingerprint,
      p_user_agent: navigator.userAgent,
      p_success: false, // será true se signup funcionar
    });

    // 6. Criar conta
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // 7. Atualizar tentativa como sucesso
    await supabase.rpc('register_signup_attempt', {
      p_ip_address: ipAddress,
      p_email: email,
      p_device_fingerprint: deviceFingerprint,
      p_user_agent: navigator.userAgent,
      p_success: true,
    });

    // Sucesso!
    window.location.href = '/calculator';
  };

  return (
    // ... JSX
  );
}
```

### 4.5 Criar API Route para Verificar reCAPTCHA

Arquivo: `app/api/verify-recaptcha/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secretKey}&response=${token}`,
  });

  const data = await response.json();

  return NextResponse.json({
    success: data.success,
    score: data.score,
  });
}
```

---

## ✅ ETAPA 5: CRIAR PÁGINA DE INVENTÁRIO

Arquivo: `app/inventory/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface InventoryItem {
  id: string;
  type: 'filament' | 'addon';
  name: string;
  stock: number;
  threshold: number;
  unit: string;
  value: number;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Buscar filamentos
    const { data: filaments } = await supabase
      .from('custom_filaments')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    // Buscar adereços
    const { data: addons } = await supabase
      .from('custom_addons')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    // Buscar itens com estoque baixo
    const { data: low } = await supabase
      .rpc('get_low_stock_items', { p_user_id: user.id });

    setLowStock(low || []);
    setItems([
      ...(filaments || []).map((f: any) => ({
        id: f.id,
        type: 'filament',
        name: `${f.brand} ${f.type}`,
        stock: parseFloat(f.stock_quantity),
        threshold: parseFloat(f.stock_alert_threshold),
        unit: 'g',
        value: parseFloat(f.price_per_kg) * parseFloat(f.stock_quantity) / 1000,
      })),
      ...(addons || []).map((a: any) => ({
        id: a.id,
        type: 'addon',
        name: a.name,
        stock: a.stock_quantity,
        threshold: a.stock_alert_threshold,
        unit: a.unit,
        value: parseFloat(a.price_per_unit) * a.stock_quantity,
      })),
    ]);
    setLoading(false);
  };

  const totalValue = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-orange-50/30 dark:from-black dark:via-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-8">
          📦 Gestão de Inventário
        </h1>

        {/* Alertas de Estoque Baixo */}
        {lowStock.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4">
              ⚠️ Alertas de Estoque Baixo ({lowStock.length})
            </h2>
            <div className="space-y-2">
              {lowStock.map((item: any) => (
                <div key={item.item_id} className="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-lg">
                  <span className="font-semibold">{item.item_name}</span>
                  <span className="text-red-600 dark:text-red-400">
                    {item.current_stock} {item.unit} (mínimo: {item.threshold} {item.unit})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border-2 border-blue-200">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Total de Itens</h3>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{items.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border-2 border-green-200">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Valor Total em Estoque</h3>
            <p className="text-3xl font-black text-green-600 dark:text-green-400">
              R$ {totalValue.toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border-2 border-orange-200">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Itens com Estoque Baixo</h3>
            <p className="text-3xl font-black text-orange-600 dark:text-orange-400">{lowStock.length}</p>
          </div>
        </div>

        {/* Tabela de Inventário */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-orange-500 to-amber-500">
              <tr>
                <th className="px-6 py-4 text-left text-white font-bold">Item</th>
                <th className="px-6 py-4 text-left text-white font-bold">Tipo</th>
                <th className="px-6 py-4 text-right text-white font-bold">Estoque</th>
                <th className="px-6 py-4 text-right text-white font-bold">Alerta</th>
                <th className="px-6 py-4 text-right text-white font-bold">Valor</th>
                <th className="px-6 py-4 text-center text-white font-bold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className={`${idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-900'} hover:bg-orange-50 dark:hover:bg-orange-900/20`}>
                  <td className="px-6 py-4 font-semibold">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.type === 'filament' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {item.type === 'filament' ? 'Filamento' : 'Adereço'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={item.stock <= item.threshold ? 'text-red-600 font-bold' : ''}>
                      {item.stock} {item.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500">{item.threshold} {item.unit}</td>
                  <td className="px-6 py-4 text-right font-semibold text-green-600">R$ {item.value.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 font-semibold">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
```

---

## 🎯 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] **Etapa 1**: Executar migration no Supabase
- [ ] **Etapa 2**: Migrar dados do localStorage
- [ ] **Etapa 3**: Atualizar lib/storage.ts
- [ ] **Etapa 4**: Implementar proteção contra abuso
- [ ] **Etapa 5**: Criar página de inventário
- [ ] **Teste**: Verificar isolamento de dados
- [ ] **Teste**: Testar rate limiting
- [ ] **Teste**: Verificar controle de estoque
- [ ] **Deploy**: Fazer deploy em produção

---

## 📞 SUPORTE

Se tiver problemas, verifique:
1. Logs do Supabase Dashboard
2. Console do navegador
3. Network tab (requisições falhando)

**Pronto para começar? Execute a Etapa 1!** 🚀
