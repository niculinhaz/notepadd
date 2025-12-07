import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { TamaguiProvider } from '@tamagui/core';
import { config } from './../tamagui.config';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, useState, useMemo } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const AppThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export default function RootLayout() {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme ?? 'light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const ctxValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <AppThemeContext.Provider value={ctxValue}>
      <TamaguiProvider config={config} defaultTheme={theme}>
        <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </TamaguiProvider>
    </AppThemeContext.Provider>
  );
}
