import React from 'react';
import { View, Text } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import { AttributesStyles } from '../styles/AttributesStyles';
import { CustomList } from '../components/CustomList';

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

      <CustomList
        data={attributes}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}
        renderItem={({ item }) => (
          <View style={AttributesStyles.attributeContainer}>
            <Text style={AttributesStyles.attributeTitle}>{item.name}</Text>
            <Text style={{ color: '#C0C5FF', marginBottom: 8 }}>{item.label}</Text>

            <View style={AttributesStyles.progressBar}>
              <View style={[AttributesStyles.progressFill, { width: `${item.value}%` }]} />
            </View>

            <Text style={{
              color: '#7C83FD',
              marginTop: 8,
              fontFamily: 'Orbitron-SemiBold'
            }}>
              {item.value}%
            </Text>

          </View>
        )}
      />
    </View>
  );
}
