
import { ConstructionStage, StageConfig } from './types';

export const CONSTRUCTION_STAGES: StageConfig[] = [
  {
    id: ConstructionStage.FOUNDATION,
    title: 'Etapa 1: Fundação e Estrutura',
    icon: 'fa-trowel-bricks',
    description: 'Concreto aparente, armações e clima de canteiro ativo.',
    prompt: 'Renderize este projeto de rooftop mostrando a fase de fundação e estrutura. A laje e os pilares devem estar em concreto aparente, sem reboco, com armações metálicas e escoras de madeira. O fundo deve ter o pôr do sol e árvores. Adicione poeira e materiais de obra espalhados, transmitindo o clima de um canteiro de obras ativo. Estilo: realistic construction site lighting, raw concrete textures, cinematic realism.'
  },
  {
    id: ConstructionStage.MASONRY,
    title: 'Etapa 2: Alvenaria e Revestimentos',
    icon: 'fa-hammer',
    description: 'Blocos cerâmicos, reboco fresco e operários.',
    prompt: 'Mostre este rooftop na fase de levantamento das paredes e aplicação de revestimentos. Paredes em bloco cerâmico aparente, partes com reboco fresco cinza, piso em preparação e o telhado sendo montado. Inclua operários trabalhando, andaimes e ferramentas espalhadas. Iluminação de sol poente quente. Estilo: realistic building progress, detailed textures, warm sunlight.'
  },
  {
    id: ConstructionStage.FINISHING,
    title: 'Etapa 3: Acabamento e Instalações',
    icon: 'fa-paint-roller',
    description: 'Pintura, vidros e detalhes de elétrica.',
    prompt: 'Represente a fase de acabamento final deste rooftop: pintura das paredes em off-white acetinado, instalação dos vidros, madeira sendo envernizada, elétrica e iluminação em execução. Adicione andaimes leves, baldes de tinta e ferramentas de acabamento. Estilo: hyper-realistic render, warm tone lighting, construction detail.'
  },
  {
    id: ConstructionStage.COMPLETED,
    title: 'Etapa 4: Obra Concluída',
    icon: 'fa-house-circle-check',
    description: 'Render final hiper-realista com acabamento premium.',
    prompt: 'Transforme esta imagem em um render hiper-realista impecável ao pôr do sol. Texturas detalhadas, iluminação suave e natural, reflexos realistas nos vidros e metal, acabamento impecável na madeira. Piso de cimento queimado polido, guarda-corpo de vidro laminado com estrutura metálica preta, paredes com pintura off-white acetinada. Adicione plantas tropicais realistas, luminárias LED embutidas, reflexo solar nas janelas e céu alaranjado com nuvens suaves. Câmera em ângulo levemente inferior. Estilo: Ultra-realistic render, cinematic lighting, depth of field, 8K resolution, global illumination, photoreal textures, physically based rendering.'
  }
];

export const MOCK_BASE_IMAGE = 'https://images.unsplash.com/photo-1590059235ef8-17a46452f36c?q=80&w=1600&auto=format&fit=crop';
