// app/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import { PlayerProvider } from '../contexts/PlayerContext';

export default function Layout() {
  const segments = useSegments();
  const router = useRouter();

  // Esconder nav bar apenas na tela de criação
  const showNavBar = !segments.includes('create');

  return (
    <PlayerProvider>
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
          <Stack.Screen name="inventory" />
          <Stack.Screen name="store" /> {/* Se ainda não estiver aqui, adicione */}
        </Stack>

        {/* Barra de navegação inferior */}
        {showNavBar && (
          <View style={GlobalStyle.navContainer}>
            <TouchableOpacity
              style={GlobalStyle.navButton}
              onPress={() => router.push('/')}
            >
              <Text
                style={[
                  GlobalStyle.navText,
                  segments[0] === 'index' && { color: '#FF4655' },
                ]}
              >
                🌌 Quests
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={GlobalStyle.navButton}
              onPress={() => router.push('/attributes')}
            >
              <Text
                style={[
                  GlobalStyle.navText,
                  segments[0] === 'attributes' && { color: '#FF4655' },
                ]}
              >
                📊 Attributes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={GlobalStyle.navButton}
              onPress={() => router.push('/inventory')}
            >
              <Text
                style={[
                  GlobalStyle.navText,
                  segments[0] === 'inventory' && { color: '#FF4655' },
                ]}
              >
                💎 Inventory
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={GlobalStyle.navButton}
              onPress={() => router.push('/store')}
            >
              <Text
                style={[
                  GlobalStyle.navText,
                  segments[0] === 'store' && { color: '#FF4655' },
                ]}
              >
                🛒 Store
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </PlayerProvider>
  );
}
