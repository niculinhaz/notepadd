import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from '@tamagui/core'

export const tamaguiConfig = createTamagui(defaultConfig);

export default tamaguiConfig

// now, make your types flow nicely back to your `tamagui` import:
type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}