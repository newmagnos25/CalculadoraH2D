import { Printer } from '@/lib/types';

export const printers: Printer[] = [
  {
    id: 'bambu-h2d',
    name: 'Bambu Lab H2D',
    brand: 'Bambu Lab',
    buildVolume: {
      x: 350,
      y: 320,
      z: 325,
    },
    powerConsumption: {
      idle: 15,
      heating: 400,
      printing: 150, // Estimativa para dupla extrusão
    },
    maxTemp: {
      hotend: 350,
      bed: 110,
    },
    features: [
      'Dupla extrusão',
      'CoreXY',
      'Câmara aquecida (65°C)',
      'Alta velocidade (1000mm/s)',
      'Hotend de alta temperatura',
      'Sistema de visão computacional',
    ],
  },
  {
    id: 'bambu-x1c',
    name: 'Bambu Lab X1 Carbon',
    brand: 'Bambu Lab',
    buildVolume: {
      x: 256,
      y: 256,
      z: 256,
    },
    powerConsumption: {
      idle: 10,
      heating: 265,
      printing: 120,
    },
    maxTemp: {
      hotend: 300,
      bed: 110,
    },
    features: [
      'Câmara fechada',
      'Micro lidar',
      'CoreXY',
      'Alta velocidade',
      'Detecção por IA',
    ],
  },
  {
    id: 'bambu-p1s',
    name: 'Bambu Lab P1S',
    brand: 'Bambu Lab',
    buildVolume: {
      x: 256,
      y: 256,
      z: 256,
    },
    powerConsumption: {
      idle: 8,
      heating: 850,
      printing: 50,
    },
    maxTemp: {
      hotend: 300,
      bed: 100,
    },
    features: [
      'Câmara fechada',
      'CoreXY',
      'Ventilador auxiliar',
      'Alta velocidade (500mm/s)',
    ],
  },
  {
    id: 'bambu-a1',
    name: 'Bambu Lab A1',
    brand: 'Bambu Lab',
    buildVolume: {
      x: 256,
      y: 256,
      z: 256,
    },
    powerConsumption: {
      idle: 5,
      heating: 1300,
      printing: 95,
    },
    maxTemp: {
      hotend: 300,
      bed: 80,
    },
    features: [
      'CoreXY',
      'Câmara aberta',
      'Boa relação custo-benefício',
    ],
  },
  {
    id: 'bambu-a1-mini',
    name: 'Bambu Lab A1 Mini',
    brand: 'Bambu Lab',
    buildVolume: {
      x: 180,
      y: 180,
      z: 180,
    },
    powerConsumption: {
      idle: 6,
      heating: 120,
      printing: 57,
    },
    maxTemp: {
      hotend: 300,
      bed: 80,
    },
    features: [
      'Compacta',
      'Baixo consumo de energia',
      'Silenciosa',
      'Ideal para iniciantes',
    ],
  },
];
