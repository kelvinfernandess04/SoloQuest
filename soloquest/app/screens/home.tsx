import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';

export default function Home() {
  return (
    <ImageBackground
    source={require('../../assets/background.jpg')}
      style={GlobalStyle.backgroundImage}
    >
      <View style={GlobalStyle.container}>
        <Text style={GlobalStyle.text}>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}