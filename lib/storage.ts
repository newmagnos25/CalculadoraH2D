import { Filament, Addon, Printer, CompanySettings, ClientData } from './types';
import { printers as defaultPrinters } from '@/data/printers';
import { filaments as defaultFilaments } from '@/data/filaments';
import { addons as defaultAddons } from '@/data/addons';
import { getCustomPrintersFromDB, saveCustomPrinterToDB, deleteCustomPrinterFromDB } from './supabase-printers';

// LocalStorage helpers para persistência de dados

const KEYS = {
  CUSTOM_FILAMENTS: 'bkl_custom_filaments',
  CUSTOM_ADDONS: 'bkl_custom_addons',
  CUSTOM_PRINTERS: 'bkl_custom_printers',
  LAST_CALCULATION: 'bkl_last_calculation',
  USER_PREFERENCES: 'bkl_preferences',
  COMPANY_SETTINGS: 'bkl_company_settings',
  CLIENTS: 'bkl_clients',
  QUOTES: 'bkl_quotes',
};

// Filamentos customizados
export function getCustomFilaments(): Filament[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.CUSTOM_FILAMENTS);
  return data ? JSON.parse(data) : [];
}

export function saveCustomFilament(filament: Filament): void {
  const existing = getCustomFilaments();
  const index = existing.findIndex(f => f.id === filament.id);

  if (index >= 0) {
    existing[index] = filament;
  } else {
    existing.push(filament);
  }

  localStorage.setItem(KEYS.CUSTOM_FILAMENTS, JSON.stringify(existing));
}

export function deleteCustomFilament(id: string): void {
  const existing = getCustomFilaments();
  const filtered = existing.filter(f => f.id !== id);
  localStorage.setItem(KEYS.CUSTOM_FILAMENTS, JSON.stringify(filtered));
}

// Adereços customizados
export function getCustomAddons(): Addon[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.CUSTOM_ADDONS);
  return data ? JSON.parse(data) : [];
}

export function saveCustomAddon(addon: Addon): void {
  const existing = getCustomAddons();
  const index = existing.findIndex(a => a.id === addon.id);

  if (index >= 0) {
    existing[index] = addon;
  } else {
    existing.push(addon);
  }

  localStorage.setItem(KEYS.CUSTOM_ADDONS, JSON.stringify(existing));
}

export function deleteCustomAddon(id: string): void {
  const existing = getCustomAddons();
  const filtered = existing.filter(a => a.id !== id);
  localStorage.setItem(KEYS.CUSTOM_ADDONS, JSON.stringify(filtered));
}

// Impressoras customizadas (HÍBRIDO: Supabase + localStorage fallback)
export async function getCustomPrinters(): Promise<Printer[]> {
  // Tentar buscar do Supabase primeiro
  try {
    const dbPrinters = await getCustomPrintersFromDB();

    if (dbPrinters.length > 0) {
      // Converter formato do DB para formato Printer
      return dbPrinters.map(p => ({
        id: p.printer_id,
        name: p.name,
        brand: p.model || 'Custom',
        buildVolume: { x: 220, y: 220, z: 250 }, // Valores padrão
        maxTemp: { hotend: 300, bed: 100 },
        powerConsumption: {
          idle: Math.floor(p.power_consumption * 0.1),
          heating: Math.floor(p.power_consumption * 0.6),
          printing: p.power_consumption
        },
        features: [],
        isCustom: true,
      }));
    }
  } catch (error) {
    console.warn('Failed to load from Supabase, using localStorage:', error);
  }

  // Fallback para localStorage
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.CUSTOM_PRINTERS);
  return data ? JSON.parse(data) : [];
}

export async function saveCustomPrinter(printer: Printer): Promise<void> {
  // Salvar no Supabase
  try {
    await saveCustomPrinterToDB({
      printer_id: printer.id,
      name: printer.name,
      model: printer.brand,
      power_consumption: printer.powerConsumption?.printing || 150,
    });
  } catch (error) {
    console.warn('Failed to save to Supabase, using localStorage:', error);

    // Fallback para localStorage
    const existing = await getCustomPrinters();
    const index = existing.findIndex(p => p.id === printer.id);

    if (index >= 0) {
      existing[index] = printer;
    } else {
      existing.push(printer);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(KEYS.CUSTOM_PRINTERS, JSON.stringify(existing));
    }
  }
}

export async function deleteCustomPrinter(id: string): Promise<void> {
  // Deletar do Supabase
  try {
    await deleteCustomPrinterFromDB(id);
  } catch (error) {
    console.warn('Failed to delete from Supabase, using localStorage:', error);

    // Fallback para localStorage
    const existing = await getCustomPrinters();
    const filtered = existing.filter(p => p.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(KEYS.CUSTOM_PRINTERS, JSON.stringify(filtered));
    }
  }
}

// Última calculação
export function saveLastCalculation(data: any): void {
  localStorage.setItem(KEYS.LAST_CALCULATION, JSON.stringify(data));
}

export function getLastCalculation(): any | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(KEYS.LAST_CALCULATION);
  return data ? JSON.parse(data) : null;
}

// Preferências do usuário
export interface UserPreferences {
  defaultPrinterId?: string;
  defaultEnergyTariff?: string;
  defaultProfitMargin?: number;
  companyName?: string;
  companyLogo?: string;
}

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(KEYS.USER_PREFERENCES);
  return data ? JSON.parse(data) : {};
}

export function saveUserPreferences(prefs: UserPreferences): void {
  const existing = getUserPreferences();
  const updated = { ...existing, ...prefs };
  localStorage.setItem(KEYS.USER_PREFERENCES, JSON.stringify(updated));
}

// Configurações da empresa
export function getCompanySettings(): CompanySettings | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(KEYS.COMPANY_SETTINGS);
  return data ? JSON.parse(data) : null;
}

export function saveCompanySettings(settings: CompanySettings): void {
  localStorage.setItem(KEYS.COMPANY_SETTINGS, JSON.stringify(settings));
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

// Clientes
export function getClients(): ClientData[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.CLIENTS);
  return data ? JSON.parse(data) : [];
}

export function saveClient(client: ClientData): void {
  const existing = getClients();
  const index = existing.findIndex(c => c.id === client.id);

  if (index >= 0) {
    existing[index] = client;
  } else {
    existing.push(client);
  }

  localStorage.setItem(KEYS.CLIENTS, JSON.stringify(existing));
}

export function deleteClient(id: string): void {
  const existing = getClients();
  const filtered = existing.filter(c => c.id !== id);
  localStorage.setItem(KEYS.CLIENTS, JSON.stringify(filtered));
}

export function getClientById(id: string): ClientData | null {
  const clients = getClients();
  return clients.find(c => c.id === id) || null;
}

// Orçamentos
export function getNextInvoiceNumber(): string {
  const settings = getCompanySettings();
  if (!settings) return 'INV-2025-001';

  const number = settings.invoiceCounter.toString().padStart(3, '0');
  return `${settings.invoicePrefix}${number}`;
}

export function incrementInvoiceCounter(): void {
  const settings = getCompanySettings();
  if (settings) {
    settings.invoiceCounter += 1;
    saveCompanySettings(settings);
  }
}

// Helpers para combinar dados default + customizados
/**
 * Retorna todas as impressoras (default + customizadas)
 */
export async function getAllPrinters(): Promise<Printer[]> {
  const customPrinters = await getCustomPrinters();
  return [...defaultPrinters, ...customPrinters];
}

/**
 * Retorna apenas impressoras default (síncrono)
 */
export function getDefaultPrinters(): Printer[] {
  return defaultPrinters;
}

/**
 * Retorna todos os filamentos (default + customizados)
 */
export function getAllFilaments(): Filament[] {
  return [...defaultFilaments, ...getCustomFilaments()];
}

/**
 * Retorna todos os adereços (default + customizados)
 */
export function getAllAddons(): Addon[] {
  return [...defaultAddons, ...getCustomAddons()];
}

/**
 * Busca impressora por ID (default ou customizada)
 */
export async function getPrinterById(id: string): Promise<Printer | undefined> {
  const allPrinters = await getAllPrinters();
  return allPrinters.find(p => p.id === id);
}

/**
 * Busca impressora por ID apenas em default printers (síncrono)
 */
export function getDefaultPrinterById(id: string): Printer | undefined {
  return defaultPrinters.find(p => p.id === id);
}

/**
 * Busca filamento por ID (default ou customizado)
 */
export function getFilamentById(id: string): Filament | undefined {
  return getAllFilaments().find(f => f.id === id);
}

/**
 * Busca adereço por ID (default ou customizado)
 */
export function getAddonById(id: string): Addon | undefined {
  return getAllAddons().find(a => a.id === id);
}
