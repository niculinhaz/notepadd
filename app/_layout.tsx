import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { createTamagui, TamaguiProvider } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';

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
    'SF-Pro-Bold': require('../assets/fonts/SF-Pro-Display-Bold.otf'), //usar sf pro bold ao invés de font weight bold
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
      </TamaguiProvider>
    </ThemeContext.Provider>
  );
}