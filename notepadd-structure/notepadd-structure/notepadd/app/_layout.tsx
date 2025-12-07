import React from 'react'; 
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config';

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#050505' } }}>
        <Stack.Screen name="(notes)/notes" />
        <Stack.Screen name="(notes)/[noteId]" />
      </Stack>
    </TamaguiProvider>
  );
}