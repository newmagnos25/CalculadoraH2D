/**
 * User Preferences Management
 * Gerencia preferências do usuário salvas no perfil (Supabase)
 */

import { createClient } from '@/lib/supabase/client';

/**
 * Salvar impressora padrão do usuário
 */
export async function saveDefaultPrinter(printerId: string): Promise<boolean> {
  try {
    const supabase = createClient();

    // Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('User not authenticated, cannot save default printer');
      return false;
    }

    // Atualizar o perfil com a impressora padrão
    const { error } = await supabase
      .from('profiles')
      .update({ default_printer_id: printerId })
      .eq('id', user.id);

    if (error) {
      console.error('Error saving default printer:', error);
      return false;
    }

    console.log('✅ Default printer saved:', printerId);
    return true;
  } catch (error) {
    console.error('Error saving default printer:', error);
    return false;
  }
}

/**
 * Carregar impressora padrão do usuário
 */
export async function loadDefaultPrinter(): Promise<string | null> {
  try {
    const supabase = createClient();

    // Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('User not authenticated, cannot load default printer');
      return null;
    }

    // Buscar o perfil do usuário
    const { data, error } = await supabase
      .from('profiles')
      .select('default_printer_id')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error loading default printer:', error);
      return null;
    }

    const printerId = data?.default_printer_id || null;
    console.log('📥 Default printer loaded:', printerId);
    return printerId;
  } catch (error) {
    console.error('Error loading default printer:', error);
    return null;
  }
}

/**
 * Limpar impressora padrão do usuário
 */
export async function clearDefaultPrinter(): Promise<boolean> {
  try {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('profiles')
      .update({ default_printer_id: null })
      .eq('id', user.id);

    if (error) {
      console.error('Error clearing default printer:', error);
      return false;
    }

    console.log('🗑️ Default printer cleared');
    return true;
  } catch (error) {
    console.error('Error clearing default printer:', error);
    return false;
  }
}
