import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createTamagui, TamaguiProvider } from 'tamagui';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { defaultConfig } from '@tamagui/config/v4';

const config = createTamagui(defaultConfig);

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
      <TamaguiProvider config={config} defaultTheme={colorScheme!}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>

          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </TamaguiProvider>
  );
}
