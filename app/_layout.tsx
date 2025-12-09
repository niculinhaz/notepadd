import { initDatabase } from "@/database/database";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultConfig } from '@tamagui/config/v4';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from "expo-sqlite";
import * as SystemUI from 'expo-system-ui';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { createTamagui, TamaguiProvider } from 'tamagui';

const config = createTamagui(defaultConfig);

SplashScreen.preventAutoHideAsync();

type ThemeType = 'light' | 'dark';

interface ThemeContextData {
  theme: ThemeType;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({
  theme: 'dark',
  isDarkMode: true,
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SF-Pro': require('../assets/fonts/SF-Pro.ttf'),
    'SF-Pro-Bold': require('../assets/fonts/SF-Pro-Bold.otf'),
    'SF-Pro-Italic': require('../assets/fonts/SF-Pro-Italic.otf'),
  });

  const [theme, setTheme] = useState<ThemeType>('dark');

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    AsyncStorage.getItem('@app_theme').then(saved => {
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
      }
    });
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    await AsyncStorage.setItem('@app_theme', newTheme);
  };

  const isDarkMode = theme === 'dark';
  const backgroundColor = isDarkMode ? '#050505' : '#f8f9fa';

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(backgroundColor);
  }, [backgroundColor]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      <TamaguiProvider config={config} defaultTheme={theme}>
        <SQLiteProvider databaseName="notepadd.db" onInit={initDatabase}>
        <StatusBar 
          barStyle={isDarkMode ? "light-content" : "dark-content"} 
          backgroundColor={backgroundColor} 
        />
          <Stack 
            screenOptions={{ 
              headerShown: false, 
              contentStyle: { backgroundColor: backgroundColor },
              animation: 'slide_from_right',
            }}
          >
            {/* Tela Inicial */}
            <Stack.Screen name="(notes)/notes" />

            {/* Tela da Nota */}
            <Stack.Screen 
              name="(notes)/[noteId]" 
              options={{ 
                presentation: 'card',
                gestureEnabled: true,
              }} 
            />
          </Stack>
        </SQLiteProvider>
      </TamaguiProvider>
    </ThemeContext.Provider>
  );
}