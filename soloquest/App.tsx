import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ImageBackground } from 'react-native';
import { GlobalStyle } from './app/styles/GlobalStyles';
import Login from './app/components/login';

export default function App() {
  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={GlobalStyle.backgroundImage}
    >
      <Login navigation={undefined} />
      <StatusBar style="auto" />
    </ImageBackground>
  );
}