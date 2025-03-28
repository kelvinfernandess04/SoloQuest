import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';



interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  owned: boolean
}

export default function Store() {
  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.titulo}>Tesouro do Caçador</Text>

     
    </View>
  );
}