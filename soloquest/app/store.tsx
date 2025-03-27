import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';

const store = [
  { type: '💰', amount: 1500, reason: 'Missão Diária Completa' },
  { type: '✨', amount: 500, reason: 'Dungeon: Portal das Sombras' },
  { type: '💎', amount: 1, reason: 'Item Raro: Cristal Arcano' },
];

export default function Store() {
  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.titulo}>Tesouro do Caçador</Text>

      <View style={[GlobalStyle.rewardCard, { marginBottom: 20 }]}>
        <Text style={{ color: '#FED053', fontSize: 24, fontFamily: 'Orbitron-SemiBold' }}>
          🏆 Nível 15
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={{ color: '#7C83FD' }}>Próximo nível: 1,200/5,000 XP</Text>
          <Text style={{ color: '#FF4655' }}>💰 2,450</Text>
        </View>
      </View>

      <FlatList
        data={store}
        renderItem={({ item }) => (
          <View style={GlobalStyle.rewardCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 24 }}>{item.type}</Text>
              <View>
                <Text style={{ color: '#E0E5FF', fontSize: 16 }}>{item.reason}</Text>
                <Text style={{ color: '#7C83FD', fontFamily: 'Orbitron-SemiBold' }}>
                  +{item.amount} {item.type === '💰' ? 'Moedas' : item.type === '💎' ? 'Unidade' : 'XP'}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}