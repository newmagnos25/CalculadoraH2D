/**
 * Supabase Custom Printers Management
 * Gerencia impressoras customizadas salvas no banco de dados
 */

import { createClient } from '@/lib/supabase/client';

export interface CustomPrinter {
  id: string; // UUID do Supabase
  user_id: string;
  printer_id: string; // ID único da impressora
  name: string;
  model?: string;
  power_consumption: number; // Watts
  created_at: string;
  updated_at: string;
}

export interface PrinterInput {
  printer_id: string;
  name: string;
  model?: string;
  power_consumption: number;
}

/**
 * Buscar todas as impressoras customizadas do usuário
 */
export async function getCustomPrintersFromDB(): Promise<CustomPrinter[]> {
  try {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('User not authenticated');
      return [];
    }

    const { data, error } = await supabase
      .from('custom_printers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching custom printers:', error);
      return [];
    }

    console.log(`📥 Loaded ${data?.length || 0} custom printers from database`);
    return data || [];
  } catch (error) {
    console.error('Error fetching custom printers:', error);
    return [];
  }
}

/**
 * Salvar nova impressora customizada
 */
export async function saveCustomPrinterToDB(printer: PrinterInput): Promise<CustomPrinter | null> {
  try {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return null;
    }

    // Verificar se printer_id já existe para este usuário
    const { data: existing } = await supabase
      .from('custom_printers')
      .select('id')
      .eq('user_id', user.id)
      .eq('printer_id', printer.printer_id)
      .single();

    if (existing) {
      // Atualizar impressora existente
      const { data, error } = await supabase
        .from('custom_printers')
        .update({
          name: printer.name,
          model: printer.model,
          power_consumption: printer.power_consumption,
        })
        .eq('user_id', user.id)
        .eq('printer_id', printer.printer_id)
        .select()
        .single();

      if (error) {
        console.error('Error updating custom printer:', error);
        return null;
      }

      console.log('✅ Custom printer updated:', data);
      return data;
    } else {
      // Criar nova impressora
      const { data, error } = await supabase
        .from('custom_printers')
        .insert([{
          user_id: user.id,
          printer_id: printer.printer_id,
          name: printer.name,
          model: printer.model,
          power_consumption: printer.power_consumption,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving custom printer:', error);
        return null;
      }

      console.log('✅ Custom printer saved:', data);
      return data;
    }
  } catch (error) {
    console.error('Error saving custom printer:', error);
    return null;
  }
}

/**
 * Deletar impressora customizada
 */
export async function deleteCustomPrinterFromDB(printerId: string): Promise<boolean> {
  try {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('custom_printers')
      .delete()
      .eq('user_id', user.id)
      .eq('printer_id', printerId);

    if (error) {
      console.error('Error deleting custom printer:', error);
      return false;
    }

    console.log('🗑️ Custom printer deleted:', printerId);
    return true;
  } catch (error) {
    console.error('Error deleting custom printer:', error);
    return false;
  }
}

/**
 * Migrar impressoras do localStorage para Supabase
 * (útil para usuários existentes)
 */
export async function migrateLocalPrintersToSupabase(): Promise<number> {
  try {
    if (typeof window === 'undefined') return 0;

    // Buscar impressoras do localStorage
    const localPrinters = localStorage.getItem('custom_printers');
    if (!localPrinters) return 0;

    const printers = JSON.parse(localPrinters);
    if (!Array.isArray(printers) || printers.length === 0) return 0;

    // Salvar cada uma no Supabase
    let migrated = 0;
    for (const printer of printers) {
      const saved = await saveCustomPrinterToDB({
        printer_id: printer.id,
        name: printer.name,
        model: printer.model,
        power_consumption: printer.powerConsumption,
      });

      if (saved) migrated++;
    }

    // Se migração bem-sucedida, pode limpar localStorage
    if (migrated > 0) {
      console.log(`🔄 Migrated ${migrated} printers from localStorage to Supabase`);
      // Opcional: localStorage.removeItem('custom_printers');
    }

    return migrated;
  } catch (error) {
    console.error('Error migrating printers:', error);
    return 0;
  }
}
