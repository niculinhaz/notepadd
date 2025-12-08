import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui, createFont, createTokens, styled } from '@tamagui/core'

// Fonte SF-Pro
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

export const tamaguiConfig = createTamagui({

  ...defaultConfig,

  fonts: {
    heading: sfProFont,
    body: sfProFont,
  },

})

export default tamaguiConfig

type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}