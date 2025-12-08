import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { createTamagui, TamaguiProvider } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  if (!fontsLoaded) {
    return null;
  }

  const isDarkMode = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      <TamaguiProvider config={config} defaultTheme={theme}>
        <StatusBar 
          barStyle={isDarkMode ? "light-content" : "dark-content"} 
          backgroundColor={isDarkMode ? "#050505" : "#f8f9fa"} 
        />
        <Stack 
          screenOptions={{ 
            headerShown: false, 
            contentStyle: { backgroundColor: isDarkMode ? '#050505' : '#f8f9fa' } 
          }}
        >
          <Stack.Screen name="(notes)/notes" />
          <Stack.Screen name="(notes)/[noteId]" />
        </Stack>
      </TamaguiProvider>
    </ThemeContext.Provider>
  );
}