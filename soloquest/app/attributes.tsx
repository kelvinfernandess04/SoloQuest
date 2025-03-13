import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import { Link } from 'expo-router';

const attributes = [
  { name: 'STR', value: 75, label: 'Força' },
  { name: 'AGI', value: 60, label: 'Agilidade' },
  { name: 'VIT', value: 85, label: 'Vitalidade' },
  { name: 'INT', value: 90, label: 'Inteligência' },
  { name: 'PER', value: 70, label: 'Percepção' },
  { name: 'DEX', value: 80, label: 'Destreza' },
];

export default function Attributes() {
  return (
    <View style={GlobalStyle.container}>
      <Text style={[GlobalStyle.titulo, { marginBottom: 30 }]}>Status do Caçador</Text>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {attributes.map((attr) => (
          <View key={attr.name} style={GlobalStyle.attributeContainer}>
            <Text style={GlobalStyle.attributeTitle}>{attr.name}</Text>
            <Text style={{ color: '#C0C5FF', marginBottom: 8 }}>{attr.label}</Text>
            
            <View style={GlobalStyle.progressBar}>
              <View style={[GlobalStyle.progressFill, { width: `${attr.value}%` }]} />
            </View>
            
            <Text style={{ 
              color: '#7C83FD', 
              marginTop: 8,
              fontFamily: 'Orbitron-SemiBold'
            }}>
              {attr.value}%
            </Text>
          </View>
        ))}
      </View>
      
    </View>
    
  );
}