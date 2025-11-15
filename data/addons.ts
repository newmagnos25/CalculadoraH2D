import { Addon } from '@/lib/types';

// Adereços e inserções - DIFERENCIAL DA NOSSA CALCULADORA!
export const addons: Addon[] = [
  // Inserções metálicas (heat inserts)
  {
    id: 'insert-m2',
    name: 'Inserto roscado M2',
    category: 'insert',
    pricePerUnit: 0.15,
    unit: 'un',
  },
  {
    id: 'insert-m3',
    name: 'Inserto roscado M3',
    category: 'insert',
    pricePerUnit: 0.20,
    unit: 'un',
  },
  {
    id: 'insert-m4',
    name: 'Inserto roscado M4',
    category: 'insert',
    pricePerUnit: 0.30,
    unit: 'un',
  },
  {
    id: 'insert-m5',
    name: 'Inserto roscado M5',
    category: 'insert',
    pricePerUnit: 0.40,
    unit: 'un',
  },
  {
    id: 'insert-m6',
    name: 'Inserto roscado M6',
    category: 'insert',
    pricePerUnit: 0.50,
    unit: 'un',
  },

  // Parafusos
  {
    id: 'screw-m2-6mm',
    name: 'Parafuso M2 x 6mm',
    category: 'screw',
    pricePerUnit: 0.08,
    unit: 'un',
  },
  {
    id: 'screw-m2-8mm',
    name: 'Parafuso M2 x 8mm',
    category: 'screw',
    pricePerUnit: 0.10,
    unit: 'un',
  },
  {
    id: 'screw-m3-6mm',
    name: 'Parafuso M3 x 6mm',
    category: 'screw',
    pricePerUnit: 0.10,
    unit: 'un',
  },
  {
    id: 'screw-m3-8mm',
    name: 'Parafuso M3 x 8mm',
    category: 'screw',
    pricePerUnit: 0.12,
    unit: 'un',
  },
  {
    id: 'screw-m3-10mm',
    name: 'Parafuso M3 x 10mm',
    category: 'screw',
    pricePerUnit: 0.15,
    unit: 'un',
  },
  {
    id: 'screw-m3-12mm',
    name: 'Parafuso M3 x 12mm',
    category: 'screw',
    pricePerUnit: 0.18,
    unit: 'un',
  },
  {
    id: 'screw-m4-10mm',
    name: 'Parafuso M4 x 10mm',
    category: 'screw',
    pricePerUnit: 0.20,
    unit: 'un',
  },
  {
    id: 'screw-m4-12mm',
    name: 'Parafuso M4 x 12mm',
    category: 'screw',
    pricePerUnit: 0.22,
    unit: 'un',
  },
  {
    id: 'screw-m5-10mm',
    name: 'Parafuso M5 x 10mm',
    category: 'screw',
    pricePerUnit: 0.25,
    unit: 'un',
  },
  {
    id: 'screw-m5-12mm',
    name: 'Parafuso M5 x 12mm',
    category: 'screw',
    pricePerUnit: 0.28,
    unit: 'un',
  },

  // Ímãs
  {
    id: 'magnet-5x2mm',
    name: 'Ímã neodímio 5x2mm',
    category: 'magnet',
    pricePerUnit: 0.50,
    unit: 'un',
  },
  {
    id: 'magnet-6x2mm',
    name: 'Ímã neodímio 6x2mm',
    category: 'magnet',
    pricePerUnit: 0.60,
    unit: 'un',
  },
  {
    id: 'magnet-8x3mm',
    name: 'Ímã neodímio 8x3mm',
    category: 'magnet',
    pricePerUnit: 0.80,
    unit: 'un',
  },
  {
    id: 'magnet-10x2mm',
    name: 'Ímã neodímio 10x2mm',
    category: 'magnet',
    pricePerUnit: 0.90,
    unit: 'un',
  },
  {
    id: 'magnet-10x3mm',
    name: 'Ímã neodímio 10x3mm',
    category: 'magnet',
    pricePerUnit: 1.20,
    unit: 'un',
  },
  {
    id: 'magnet-12x3mm',
    name: 'Ímã neodímio 12x3mm',
    category: 'magnet',
    pricePerUnit: 1.50,
    unit: 'un',
  },

  // Elásticos
  {
    id: 'elastic-band-small',
    name: 'Elástico fino (5cm)',
    category: 'elastic',
    pricePerUnit: 0.05,
    unit: 'un',
  },
  {
    id: 'elastic-band-medium',
    name: 'Elástico médio (10cm)',
    category: 'elastic',
    pricePerUnit: 0.10,
    unit: 'un',
  },
  {
    id: 'elastic-band-large',
    name: 'Elástico largo (15cm)',
    category: 'elastic',
    pricePerUnit: 0.15,
    unit: 'un',
  },
  {
    id: 'elastic-cord-1m',
    name: 'Cordão elástico (metro)',
    category: 'elastic',
    pricePerUnit: 2.00,
    unit: 'm',
  },

  // Colas e adesivos
  {
    id: 'glue-super',
    name: 'Super cola (3g)',
    category: 'glue',
    pricePerUnit: 3.00,
    unit: 'un',
  },
  {
    id: 'glue-epoxy',
    name: 'Cola epóxi (10g)',
    category: 'glue',
    pricePerUnit: 8.00,
    unit: 'un',
  },
  {
    id: 'glue-hot-stick',
    name: 'Bastão cola quente',
    category: 'glue',
    pricePerUnit: 0.50,
    unit: 'un',
  },

  // Fitas
  {
    id: 'tape-double-sided',
    name: 'Fita dupla face (metro)',
    category: 'tape',
    pricePerUnit: 1.50,
    unit: 'm',
  },
  {
    id: 'tape-kapton',
    name: 'Fita Kapton (metro)',
    category: 'tape',
    pricePerUnit: 3.00,
    unit: 'm',
  },
  {
    id: 'tape-painters',
    name: 'Fita crepe/pintores (metro)',
    category: 'tape',
    pricePerUnit: 0.50,
    unit: 'm',
  },

  // Outros
  {
    id: 'bearing-608',
    name: 'Rolamento 608',
    category: 'other',
    pricePerUnit: 3.50,
    unit: 'un',
  },
  {
    id: 'bearing-625',
    name: 'Rolamento 625',
    category: 'other',
    pricePerUnit: 2.50,
    unit: 'un',
  },
  {
    id: 'spring-compression',
    name: 'Mola compressão pequena',
    category: 'other',
    pricePerUnit: 0.30,
    unit: 'un',
  },
  {
    id: 'o-ring',
    name: 'O-ring (vários tamanhos)',
    category: 'other',
    pricePerUnit: 0.20,
    unit: 'un',
  },
];

// Helpers para filtrar por categoria
export function getAddonsByCategory(category: Addon['category']): Addon[] {
  return addons.filter(a => a.category === category);
}

export const addonCategories = {
  insert: 'Inserções Metálicas',
  screw: 'Parafusos',
  magnet: 'Ímãs',
  elastic: 'Elásticos',
  glue: 'Colas e Adesivos',
  tape: 'Fitas',
  other: 'Outros',
};
