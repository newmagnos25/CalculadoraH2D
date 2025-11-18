/**
 * Product Templates System
 * Allows users to save frequently used product configurations
 */

export interface ProductTemplate {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;

  // Calculator data
  printerId: string;
  filamentUsages: Array<{
    filamentId: string;
    weight: number;
  }>;
  printTime: {
    hours: number;
    minutes: number;
  };
  selectedAddons: Array<{
    id: string;
    quantity: number;
  }>;
  itemDescription: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

const TEMPLATES_STORAGE_KEY = 'product_templates';

/**
 * Get all saved templates
 */
export function getTemplates(): ProductTemplate[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading templates:', error);
    return [];
  }
}

/**
 * Save a new template
 */
export function saveTemplate(template: Omit<ProductTemplate, 'id' | 'createdAt' | 'updatedAt'>): ProductTemplate {
  const templates = getTemplates();

  const newTemplate: ProductTemplate = {
    ...template,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  templates.push(newTemplate);
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));

  return newTemplate;
}

/**
 * Update an existing template
 */
export function updateTemplate(id: string, updates: Partial<Omit<ProductTemplate, 'id' | 'createdAt'>>): ProductTemplate | null {
  const templates = getTemplates();
  const index = templates.findIndex(t => t.id === id);

  if (index === -1) return null;

  templates[index] = {
    ...templates[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  return templates[index];
}

/**
 * Delete a template
 */
export function deleteTemplate(id: string): boolean {
  const templates = getTemplates();
  const filtered = templates.filter(t => t.id !== id);

  if (filtered.length === templates.length) return false;

  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Get a single template by ID
 */
export function getTemplate(id: string): ProductTemplate | null {
  const templates = getTemplates();
  return templates.find(t => t.id === id) || null;
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Export templates as JSON
 */
export function exportTemplates(): string {
  const templates = getTemplates();
  return JSON.stringify(templates, null, 2);
}

/**
 * Import templates from JSON
 */
export function importTemplates(jsonString: string): boolean {
  try {
    const templates = JSON.parse(jsonString);

    if (!Array.isArray(templates)) {
      throw new Error('Invalid format');
    }

    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    return true;
  } catch (error) {
    console.error('Error importing templates:', error);
    return false;
  }
}
