import { Paragraph } from './node_modules/@tamagui/text/src/Paragraph';
import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui, createFont, createTokens, styled } from 'tamagui';

const sfProFont = createFont({
  family: 'SF-Pro',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 40,
    10: 48,
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 24,
    4: 28,
    5: 32,
    6: 36,
    7: 40,
    8: 48,
    9: 56,
    10: 64,
  },
  weight: {
    4: '400',
    6: '600',
    7: '700',
  },
  letterSpacing: {
    4: 0,
    6: -0.5,
    7: -1,
  },
  face: {
    400: { normal: 'SF-Pro' },
    600: { normal: 'SF-Pro' },
    700: { normal: 'SF-Pro' },
  },
});

const myLightColors = {
  background: '#f5f5f7',         // Fundo da tela
  color: '#1a1a1a',             // Cor do texto
  backgroundStrong: '#ffffff',  // Fundo dos cards/elementos
  borderColor: '#e0e0e0',       // Borda
  
  // CORES DE CONTRASTE
  card: '#ffffff',
  header: '#f5f5f7',
  contrast: '#7C3AED',
  contrastText: '#FFE66D',
} as const; 

const myDarkColors = {
  background: '#0d0d0f',
  color: '#ffffff', 
  backgroundStrong: '#1b1b1d', 
  borderColor: '#333333',
  
  card: '#1b1b1d',
  header: '#ffffffff',
  contrast: '#7C3AED',
  contrastText: '#FFE66D',
} as const;

export const tamaguiConfig = createTamagui({
  ...defaultConfig,

  fonts: {
    heading: sfProFont,
    body: sfProFont,
  }, 

  themes: {
    
    light: {
        ...defaultConfig.themes.light, 
        ...myLightColors,             
    },
    dark: {
        ...defaultConfig.themes.dark,  
        ...myDarkColors,              
    },
  },

  tokens: {
    ...defaultConfig.tokens,
  },
});

type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;