import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import { useRouter } from 'expo-router';
import * as DbService from '../services/dbservice';

interface Quest {
  id: string;
  name: string;
  description: string;
}

export default function Home() {
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    const loadQuests = async () => {
      try {
        await DbService.createTable();
        const loadedQuests = await DbService.readQuest();
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
            const success = await DbService.deleteQuest(id);
            if (success) {
              const updatedQuests = await DbService.readQuest();
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
      <View style={GlobalStyle.headerContainer}>
        <Text style={[GlobalStyle.titulo, { marginBottom: 10 }]}>Quests</Text>
        <TouchableOpacity
          style={[GlobalStyle.headerButton, {
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8
          }]}
          onPress={() => router.push('/create')}
        >
          <Text style={{ 
            color: '#7C83FD', 
            fontFamily: 'Orbitron-SemiBold',
            fontSize: 14
          }}>
            ⚔️ NOVA
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={quests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={({ item }) => (
          <View style={[GlobalStyle.listaContainer, { 
            borderColor: '#7C83FD20',
            position: 'relative',
            marginBottom: 16
          }]}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16
            }}>
              <View style={{ flex: 1 }}>
                <Text style={[GlobalStyle.textoItem, { 
                  fontSize: 18,
                  fontFamily: 'Exo2-SemiBold',
                  color: '#E0E5FF',
                  marginBottom: 8
                }]}>
                  {item.name}
                </Text>
                <Text style={[GlobalStyle.textoItem, {
                  color: '#7C83FD',
                  fontSize: 14,
                }]}>
                  {item.description}
                </Text>
              </View>
              
              <TouchableOpacity 
                onPress={() => handleDelete(item.id)}
                style={{
                  padding: 8,
                  marginLeft: 10,
                  backgroundColor: '#FF465520',
                  borderRadius: 8
                }}
              >
                <Text style={{ 
                  color: '#FF4655', 
                  fontFamily: 'Orbitron-SemiBold',
                  fontSize: 12
                }}>
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ 
              color: '#4E54C8', 
              fontSize: 18,
              fontFamily: 'Exo2-Italic'
            }}>
              Nenhuma missão encontrada...
            </Text>
          </View>
        }
      />
    </View>
  );
}