
export type AspectRatio = '1:1' | '3:4' | '16:9';

export enum VibeType {
  TOGETHER = 'sitting_together',
  DANCING = 'dancing_party',
  CELEBRATING = 'celebrating',
  CARTOON = 'cartoon_style',
  CYBERPUNK = 'cyberpunk',
  BEACH_DAY = 'beach_day',
  RETRO_90S = 'retro_90s',
  FESTIVAL = 'festival',
  STARTUP = 'startup',
  FANTASY = 'fantasy'
}

export interface VibeOption {
  id: VibeType;
  label: string;
  emoji: string;
  promptSuffix: string;
  description: string;
}

export interface GeneratedImageResult {
  imageUrl: string;
  promptUsed: string;
}
