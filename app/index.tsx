// app/index.tsx  (Home)
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import { HomeStyles } from '../styles/HomeStyles';
import { CustomList } from '../components/CustomList';
import * as dbQuestService from '../services/dbQuestService';
import { computeReward } from '../services/dbRewardService';
import { usePlayer } from '../contexts/PlayerContext';
import { useRouter } from 'expo-router';

interface Quest { id: string; name: string; description: string; points: number; }

export default function Home() {
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);
  const { addCoins, gainXP } = usePlayer();

  const loadQuests = async () => {
    await dbQuestService.createTable();
    setQuests(await dbQuestService.readQuest());
  };

  useEffect(() => { loadQuests(); }, []);

  const handleComplete = (q: Quest) => {
    Alert.alert('Concluir Missão', `Deseja concluir "${q.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          const { coins, xp, item } = await computeReward(q.points);
          addCoins(coins);
          gainXP(xp);

          // remove a quest
          await dbQuestService.deleteQuest(q.id);
          loadQuests();

          // feedback ao jogador
          let msg = `Você ganhou ${coins} 🪙 e ${xp} XP.`;
          if (item) msg += `\nAlém disso, obteve um ${item.quality} "${item.name}".`;
          Alert.alert('Missão Concluída!', msg, [{ text:'OK' }]);
        }
      }
    ]);
  };

  return (
    <View style={GlobalStyle.container}>
      <View style={HomeStyles.headerContainer}>
        <Text style={[GlobalStyle.titulo, { marginBottom: 10 }]}>Quests</Text>
        <TouchableOpacity
          style={[HomeStyles.headerButton, HomeStyles.headerButtonAlt]}
          onPress={() => router.push('/create')}
        >
          <Text style={HomeStyles.deleteButtonText}>⚔️ NOVA</Text>
        </TouchableOpacity>
      </View>

      <CustomList
        data={quests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[HomeStyles.listaContainer, HomeStyles.questContainer]}>
            <View style={HomeStyles.questContent}>
              <View style={{ flex: 1 }}>
                <Text style={HomeStyles.questName}>{item.name}</Text>
                <Text style={HomeStyles.questInfo}>{item.description}</Text>
                <Text style={HomeStyles.questInfo}>{item.points} pontos</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleComplete(item)}
                style={[HomeStyles.deleteButton, { backgroundColor: '#4CAF5050' }]}
              >
                <Text style={HomeStyles.deleteButtonText}>Concluir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push({ pathname: '/edit', params: { id: item.id } })}
                style={[HomeStyles.deleteButton, { backgroundColor: '#4E54C8' }]}
              >
                <Text style={HomeStyles.deleteButtonText}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        emptyMessage="Nenhuma missão encontrada..."
      />
    </View>
  );
}
