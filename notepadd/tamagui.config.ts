import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui, createFont } from '@tamagui/core'

// -------------------------
// Fonte SF-Pro
// -------------------------
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
})

// -------------------------
// Cores personalizadas
// -------------------------
const lightColors = {
  background: '#f5f5f7',
  card: '#ffffff',
  text: '#1a1a1a',
  header: '#f5f5f7',

  contrast: '#7C3AED',      // roxo
  contrastText: '#FFE66D',  // amarelo
}

const darkColors = {
  background: '#0d0d0f',
  card: '#1b1b1d',
  text: '#ffffff',
  header: '#0d0d0f',

  contrast: '#7C3AED',
  contrastText: '#FFE66D',
}

// -------------------------
// Configuração final
// -------------------------
export const tamaguiConfig = createTamagui({
  ...defaultConfig,    // mantém fontes, tipos, tokens padrão do Tamagui

  fonts: {
    heading: sfProFont,
    body: sfProFont,
  }, 

  themes: {
    light: lightColors,
    dark: darkColors,
  },

  // se quiser adicionar tokens adicionais, você coloca aqui
  tokens: {
    ...defaultConfig.tokens,
  },
})

// Necessário para tipagem
type Conf = typeof tamaguiConfig
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
