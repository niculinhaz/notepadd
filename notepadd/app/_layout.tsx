import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { TamaguiProvider } from '@tamagui/core';
import { config } from './../tamagui.config';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, useState, useMemo, useEffect } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export const AppThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme ?? 'light');
  const [fontsLoaded] = useFonts({
    'SF-Pro': require('../assets/fonts/SF-Pro.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const ctxValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  if (!fontsLoaded) {
    return null;
  }
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
