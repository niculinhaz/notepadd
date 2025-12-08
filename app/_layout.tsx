import { Stack } from 'expo-router';
import { StatusBar, useColorScheme } from 'react-native';
import React, { createContext, useState, useMemo, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { createTamagui, TamaguiProvider } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';

const config = createTamagui(defaultConfig);


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
    'SF-Pro': require('../assets/fonts/SF-Pro.ttf'),
  });

  const colorScheme = useColorScheme();
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
    <TamaguiProvider config={config} defaultTheme={colorScheme!}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#050505' } }}>
        <Stack.Screen name="(notes)/notes" />
        <Stack.Screen name="(notes)/[noteId]" />
      </Stack>
    </TamaguiProvider>
    </>
  );
}