import React from 'react';
import { View, Text } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import { AttributesStyles } from '../styles/AttributesStyles';
import { CustomList } from '../components/CustomList';
import { usePlayer } from '../contexts/PlayerContext';

export default function Attributes() {
  const { attributes, level, xp, xpToNextLevel, coins } = usePlayer();

  const attributesList = Object.entries(attributes).map(([key, value]) => {
    const labelMap: Record<string, string> = {
      STR: 'Força',
      AGI: 'Agilidade',
      VIT: 'Vitalidade',
      INT: 'Inteligência',
      PER: 'Percepção',
      DEX: 'Destreza',
    };

    return {
      name: key,
      value,
      label: labelMap[key] || key,
    };
  });

  return (
    <View style={GlobalStyle.container}>
      <Text style={[GlobalStyle.titulo, { marginBottom: 10 }]}>Status do Caçador</Text>
      <Text style={{ color: '#FFF', marginBottom: 20 }}>Nível: {level} | XP: {xp}/{xpToNextLevel} | 🪙 {coins}</Text>

      <CustomList
        data={attributesList}
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
              Nível {item.value}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
