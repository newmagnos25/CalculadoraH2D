import { Filament, Addon, Printer } from './types';

// LocalStorage helpers para persistência de dados

const KEYS = {
  CUSTOM_FILAMENTS: 'bkl_custom_filaments',
  CUSTOM_ADDONS: 'bkl_custom_addons',
  CUSTOM_PRINTERS: 'bkl_custom_printers',
  LAST_CALCULATION: 'bkl_last_calculation',
  USER_PREFERENCES: 'bkl_preferences',
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

// Impressoras customizadas
export function getCustomPrinters(): Printer[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.CUSTOM_PRINTERS);
  return data ? JSON.parse(data) : [];
}

export function saveCustomPrinter(printer: Printer): void {
  const existing = getCustomPrinters();
  const index = existing.findIndex(p => p.id === printer.id);

  if (index >= 0) {
    existing[index] = printer;
  } else {
    existing.push(printer);
  }

  localStorage.setItem(KEYS.CUSTOM_PRINTERS, JSON.stringify(existing));
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
