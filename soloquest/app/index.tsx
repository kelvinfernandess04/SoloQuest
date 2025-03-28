import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import { useRouter } from 'expo-router';
import * as dbQuestService from '../services/dbQuestService';
import { HomeStyles } from '../styles/HomeStyles';
import { CustomList } from '../components/CustomList';

interface Quest {
  id: string;
  name: string;
  description: string;
  points: number;
}

export default function Home() {
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    const loadQuests = async () => {
      try {
        await dbQuestService.createTable();
        const loadedQuests = await dbQuestService.readQuest();
        setQuests(loadedQuests);
      } catch (error) {
        Alert.alert('Erro', 'Falha ao carregar missões');
        console.error(error);
      }
    };
    loadQuests();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Confirmação', 'Deseja realmente excluir esta missão?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        onPress: async () => {
          try {
            const success = await dbQuestService.deleteQuest(id);
            if (success) {
              const updatedQuests = await dbQuestService.readQuest();
              setQuests(updatedQuests);
            }
          } catch (error) {
            Alert.alert('Erro', 'Falha ao excluir missão');
            console.error(error);
          }
        },
      },
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
          <Text style={HomeStyles.deleteButtonText}>
            ⚔️ NOVA
          </Text>
        </TouchableOpacity>
      </View>

      <CustomList
        data={quests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[HomeStyles.listaContainer, HomeStyles.questContainer]}>
            <View style={HomeStyles.questContent}>
              <View style={{ flex: 1 }}>
                <Text style={[HomeStyles.questName]}>
                  {item.name}
                </Text>
                <Text style={HomeStyles.questInfo}>
                  {item.description}
                </Text>
                <Text style={HomeStyles.questInfo}>
                  {item.points}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={HomeStyles.deleteButton}
              >
                <Text style={HomeStyles.deleteButtonText}>
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        emptyMessage="Nenhuma missão encontrada..."
      />
    </View>
  );
}