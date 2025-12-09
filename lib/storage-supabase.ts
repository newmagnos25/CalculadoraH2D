/**
 * Supabase Storage Layer
 * Migração completa do localStorage para Supabase
 * Mantém API compatível com lib/storage.ts
 */

import { createClient } from '@/lib/supabase/client';
import { Filament, Addon, Printer, CompanySettings, ClientData } from './types';
import { printers as defaultPrinters } from '@/data/printers';
import { filaments as defaultFilaments } from '@/data/filaments';
import { addons as defaultAddons } from '@/data/addons';

// ============================================
// TIPOS SUPABASE (Database Schema)
// ============================================

interface SupabaseFilament {
  id: string;
  user_id: string;
  brand: string;
  type: string;
  color: string | null;
  price_per_kg: number;
  stock_quantity?: number;
  stock_alert_threshold?: number;
  purchase_date?: string;
  supplier?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface SupabaseAddon {
  id: string;
  user_id: string;
  name: string;
  category: string;
  price_per_unit: number;
  unit: string;
  stock_quantity?: number;
  stock_alert_threshold?: number;
  purchase_date?: string;
  supplier?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface SupabasePrinter {
  id: string;
  user_id: string;
  name: string;
  brand?: string;
  model?: string;
  power_consumption_watts: number;
  build_volume_x?: number;
  build_volume_y?: number;
  build_volume_z?: number;
  purchase_price?: number;
  purchase_date?: string;
  depreciation_months?: number;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface SupabaseCompanySettings {
  id: string;
  user_id: string;
  name: string;
  trade_name?: string;
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  invoice_prefix: string;
  invoice_counter: number;
  payment_terms?: string;
  bank_details?: string;
  legal_notes?: string;
  brand_color: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// MAPEAMENTO: localStorage ↔ Supabase
// ============================================

function mapFilamentToSupabase(filament: Filament, userId: string): Partial<SupabaseFilament> {
  return {
    id: filament.id,
    user_id: userId,
    brand: filament.brand,
    type: filament.type,
    color: null, // Color não é mapeado (Filament type usa colors[] array)
    price_per_kg: filament.pricePerKg, // Mapeamento: pricePerKg → price_per_kg
    is_active: true,
  };
}

function mapFilamentFromSupabase(data: SupabaseFilament): Filament {
  // Defaults razoáveis para filamentos customizados
  const defaultDensity = 1.24; // PLA
  const defaultPrintTemp = { min: 190, max: 220 };
  const defaultBedTemp = { min: 50, max: 70 };

  return {
    id: data.id,
    brand: data.brand,
    type: data.type,
    pricePerKg: data.price_per_kg, // Mapeamento: price_per_kg → pricePerKg
    density: defaultDensity,
    printTemp: defaultPrintTemp,
    bedTemp: defaultBedTemp,
  };
}

function mapAddonToSupabase(addon: Addon, userId: string): Partial<SupabaseAddon> {
  return {
    id: addon.id,
    user_id: userId,
    name: addon.name,
    category: addon.category,
    price_per_unit: addon.pricePerUnit, // Mapeamento: pricePerUnit → price_per_unit
    unit: addon.unit || 'un',
    is_active: true,
  };
}

function mapAddonFromSupabase(data: SupabaseAddon): Addon {
  return {
    id: data.id,
    name: data.name,
    category: data.category as 'insert' | 'screw' | 'magnet' | 'elastic' | 'glue' | 'tape' | 'other',
    pricePerUnit: data.price_per_unit, // Mapeamento: price_per_unit → pricePerUnit
    unit: data.unit as 'un' | 'g' | 'ml' | 'm',
  };
}

function mapPrinterToSupabase(printer: Printer, userId: string): Partial<SupabasePrinter> {
  return {
    id: printer.id,
    user_id: userId,
    name: printer.name,
    brand: printer.brand,
    model: undefined, // Printer type não tem model separado
    power_consumption_watts: printer.powerConsumption.printing, // Usar consumo médio durante impressão
    build_volume_x: printer.buildVolume?.x,
    build_volume_y: printer.buildVolume?.y,
    build_volume_z: printer.buildVolume?.z,
    is_active: true,
  };
}

function mapPrinterFromSupabase(data: SupabasePrinter): Printer {
  const powerWatts = data.power_consumption_watts || 200; // Default 200W

  return {
    id: data.id,
    name: data.name,
    brand: data.brand || '',
    buildVolume: {
      x: data.build_volume_x || 0,
      y: data.build_volume_y || 0,
      z: data.build_volume_z || 0,
    },
    powerConsumption: {
      idle: powerWatts * 0.3, // ~30% em idle
      heating: powerWatts * 0.8, // ~80% aquecendo
      printing: powerWatts, // 100% imprimindo (valor armazenado)
    },
    maxTemp: {
      hotend: 300, // Default
      bed: 110, // Default
    },
    features: [],
  };
}

function mapCompanySettingsToSupabase(settings: CompanySettings, userId: string): Partial<SupabaseCompanySettings> {
  return {
    user_id: userId,
    name: settings.name || '',
    trade_name: settings.tradeName,
    cnpj: settings.cnpj,
    address: settings.address,
    city: settings.city,
    state: settings.state,
    zip_code: settings.zipCode,
    phone: settings.phone,
    email: settings.email,
    website: settings.website,
    logo_url: settings.logo, // Mapeamento: logo → logo_url
    invoice_prefix: settings.invoicePrefix || 'INV-2025-',
    invoice_counter: settings.invoiceCounter || 1,
    payment_terms: settings.paymentTerms,
    bank_details: settings.bankDetails,
    legal_notes: settings.legalNotes,
    brand_color: settings.brandColor || '#F97316',
  };
}

function mapCompanySettingsFromSupabase(data: SupabaseCompanySettings): CompanySettings {
  return {
    name: data.name || '',
    tradeName: data.trade_name,
    cnpj: data.cnpj,
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    zipCode: data.zip_code || '',
    phone: data.phone || '',
    email: data.email || '',
    website: data.website,
    logo: data.logo_url, // Mapeamento: logo_url → logo
    invoicePrefix: data.invoice_prefix || 'INV-2025-',
    invoiceCounter: data.invoice_counter || 1,
    paymentTerms: data.payment_terms || '',
    bankDetails: data.bank_details,
    legalNotes: data.legal_notes,
    brandColor: data.brand_color,
  };
}

// ============================================
// FUNÇÕES PRINCIPAIS: FILAMENTS
// ============================================

export async function getCustomFilaments(): Promise<Filament[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from('custom_filaments')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching filaments:', error);
      return [];
    }

    return (data || []).map(mapFilamentFromSupabase);
  } catch (err) {
    console.error('Error in getCustomFilaments:', err);
    return [];
  }
}

export async function saveCustomFilament(filament: Filament): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const supabaseFilament = mapFilamentToSupabase(filament, user.id);

    const { error } = await supabase
      .from('custom_filaments')
      .upsert(supabaseFilament, {
        onConflict: 'id',
      });

    if (error) throw error;
  } catch (err) {
    console.error('Error saving filament:', err);
    throw err;
  }
}

export async function deleteCustomFilament(id: string): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    // Soft delete: marcar como inativo
    const { error } = await supabase
      .from('custom_filaments')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (err) {
    console.error('Error deleting filament:', err);
    throw err;
  }
}

// ============================================
// FUNÇÕES PRINCIPAIS: ADDONS
// ============================================

export async function getCustomAddons(): Promise<Addon[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from('custom_addons')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching addons:', error);
      return [];
    }

    return (data || []).map(mapAddonFromSupabase);
  } catch (err) {
    console.error('Error in getCustomAddons:', err);
    return [];
  }
}

export async function saveCustomAddon(addon: Addon): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const supabaseAddon = mapAddonToSupabase(addon, user.id);

    const { error } = await supabase
      .from('custom_addons')
      .upsert(supabaseAddon, {
        onConflict: 'id',
      });

    if (error) throw error;
  } catch (err) {
    console.error('Error saving addon:', err);
    throw err;
  }
}

export async function deleteCustomAddon(id: string): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    // Soft delete
    const { error } = await supabase
      .from('custom_addons')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (err) {
    console.error('Error deleting addon:', err);
    throw err;
  }
}

// ============================================
// FUNÇÕES PRINCIPAIS: PRINTERS
// ============================================

export async function getCustomPrinters(): Promise<Printer[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from('custom_printers')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching printers:', error);
      return [];
    }

    return (data || []).map(mapPrinterFromSupabase);
  } catch (err) {
    console.error('Error in getCustomPrinters:', err);
    return [];
  }
}

export async function saveCustomPrinter(printer: Printer): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const supabasePrinter = mapPrinterToSupabase(printer, user.id);

    const { error } = await supabase
      .from('custom_printers')
      .upsert(supabasePrinter, {
        onConflict: 'id',
      });

    if (error) throw error;
  } catch (err) {
    console.error('Error saving printer:', err);
    throw err;
  }
}

export async function deleteCustomPrinter(id: string): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    // Soft delete
    const { error } = await supabase
      .from('custom_printers')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (err) {
    console.error('Error deleting printer:', err);
    throw err;
  }
}

// ============================================
// FUNÇÕES PRINCIPAIS: COMPANY SETTINGS
// ============================================

export async function getCompanySettings(): Promise<CompanySettings | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found - not an error
        return null;
      }
      console.error('Error fetching company settings:', error);
      return null;
    }

    return data ? mapCompanySettingsFromSupabase(data) : null;
  } catch (err) {
    console.error('Error in getCompanySettings:', err);
    return null;
  }
}

export async function saveCompanySettings(settings: CompanySettings): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const supabaseSettings = mapCompanySettingsToSupabase(settings, user.id);

    const { error } = await supabase
      .from('company_settings')
      .upsert(supabaseSettings, {
        onConflict: 'user_id',
      });

    if (error) throw error;
  } catch (err) {
    console.error('Error saving company settings:', err);
    throw err;
  }
}

export function getDefaultCompanySettings(): CompanySettings {
  return {
    name: '',
    address: '',
    city: '',
    state: 'SP',
    zipCode: '',
    phone: '',
    email: '',
    invoicePrefix: 'INV-2025-',
    invoiceCounter: 1,
    paymentTerms: 'Pagamento à vista ou parcelado conforme negociação',
  };
}

// ============================================
// FUNÇÕES PRINCIPAIS: CLIENTS
// ============================================

export async function getClients(): Promise<ClientData[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getClients:', err);
    return [];
  }
}

export async function saveClient(client: ClientData): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('clients')
      .upsert({
        ...client,
        user_id: user.id,
      }, {
        onConflict: 'id',
      });

    if (error) throw error;
  } catch (err) {
    console.error('Error saving client:', err);
    throw err;
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (err) {
    console.error('Error deleting client:', err);
    throw err;
  }
}

export async function getClientById(id: string): Promise<ClientData | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching client:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getClientById:', err);
    return null;
  }
}

// ============================================
// HELPERS
// ============================================

export function getAllPrinters(): Printer[] {
  // Nota: Esta função precisa ser async agora, mas mantemos sync por compatibilidade
  // Componentes devem usar getCustomPrinters() diretamente
  return defaultPrinters;
}

export function getAllFilaments(): Filament[] {
  // Nota: Esta função precisa ser async agora, mas mantemos sync por compatibilidade
  // Componentes devem usar getCustomFilaments() diretamente
  return defaultFilaments;
}

export function getAllAddons(): Addon[] {
  // Nota: Esta função precisa ser async agora, mas mantemos sync por compatibilidade
  // Componentes devem usar getCustomAddons() diretamente
  return defaultAddons;
}

export function getPrinterById(id: string): Printer | undefined {
  return defaultPrinters.find(p => p.id === id);
}

export function getFilamentById(id: string): Filament | undefined {
  return defaultFilaments.find(f => f.id === id);
}

export function getAddonById(id: string): Addon | undefined {
  return defaultAddons.find(a => a.id === id);
}

// ============================================
// INVOICE HELPERS
// ============================================

export async function getNextInvoiceNumber(): Promise<string> {
  const settings = await getCompanySettings();
  if (!settings) return 'INV-2025-001';

  const number = settings.invoiceCounter.toString().padStart(3, '0');
  return `${settings.invoicePrefix}${number}`;
}

export async function incrementInvoiceCounter(): Promise<void> {
  const settings = await getCompanySettings();
  if (settings) {
    settings.invoiceCounter += 1;
    await saveCompanySettings(settings);
  }
}

// ============================================
// PREFERÊNCIAS (mantidas em localStorage por serem UI-only)
// ============================================

export interface UserPreferences {
  defaultPrinterId?: string;
  defaultEnergyTariff?: string;
  defaultProfitMargin?: number;
  companyName?: string;
  companyLogo?: string;
}

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem('bkl_preferences');
  return data ? JSON.parse(data) : {};
}

export function saveUserPreferences(prefs: UserPreferences): void {
  const existing = getUserPreferences();
  const updated = { ...existing, ...prefs };
  localStorage.setItem('bkl_preferences', JSON.stringify(updated));
}

// ============================================
// ÚLTIMA CALCULAÇÃO (mantida em localStorage por ser temporária)
// ============================================

export function saveLastCalculation(data: any): void {
  localStorage.setItem('bkl_last_calculation', JSON.stringify(data));
}

export function getLastCalculation(): any | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('bkl_last_calculation');
  return data ? JSON.parse(data) : null;
}
