import { Paragraph } from './node_modules/@tamagui/text/src/Paragraph';
import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui, createTokens, styled } from 'tamagui'

export const tamaguiConfig = createTamagui(defaultConfig);

export default tamaguiConfig

// now, make your types flow nicely back to your `tamagui` import:
type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}