
export enum ConstructionStage {
  ORIGINAL = 'ORIGINAL',
  FOUNDATION = 'FOUNDATION',
  MASONRY = 'MASONRY',
  FINISHING = 'FINISHING',
  COMPLETED = 'COMPLETED'
}

export interface StageConfig {
  id: ConstructionStage;
  title: string;
  description: string;
  prompt: string;
  icon: string;
}

export interface GeneratedImage {
  stage: ConstructionStage;
  url: string;
  timestamp: number;
}
