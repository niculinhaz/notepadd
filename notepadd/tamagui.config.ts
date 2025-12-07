import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from '@tamagui/core'

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
