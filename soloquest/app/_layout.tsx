import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import { useSegments } from 'expo-router';

export default function Layout() {
  const segments = useSegments();
  const router = useRouter();

  // Esconder nav bar apenas na tela de criação
  const showNavBar = !segments.includes('create');

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="create" />
        <Stack.Screen name="attributes" />
        <Stack.Screen name="rewards" />
      </Stack>

      {/* Barra de navegação inferior */}
      {showNavBar && (
        <View style={GlobalStyle.navContainer}>
          <TouchableOpacity 
            style={GlobalStyle.navButton}
            onPress={() => router.push('/')}
          >
            <Text style={[
              GlobalStyle.navText,
              segments[0] === 'index' && { color: '#FF4655' }
            ]}>
              🌌 Quests
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={GlobalStyle.navButton}
            onPress={() => router.push('/attributes')}
          >
            <Text style={[
              GlobalStyle.navText,
              segments[0] === 'attributes' && { color: '#FF4655' }
            ]}>
              📊 Attributes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={GlobalStyle.navButton}
            onPress={() => router.push('/rewards')}
          >
            <Text style={[
              GlobalStyle.navText,
              segments[0] === 'rewards' && { color: '#FF4655' }
            ]}>
              💎 Rewards
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}