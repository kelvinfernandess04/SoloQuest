import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import { useRouter } from 'expo-router';

const tasks = [
  { 
    id: '1', 
    title: 'Treinar no Duplo Dungeon', 
    category: 'Dungeon', 
    progress: 60,
    description: 'Derrotar 20 inimigos de nível B+'
  },
  { 
    id: '2', 
    title: 'Estudar Mana Control', 
    category: 'Diária', 
    progress: 100,
    description: 'Praticar controle de energia por 2h'
  },
  { 
    id: '3', 
    title: 'Caçar Orcs das Sombras', 
    category: 'Dungeon', 
    progress: 30,
    description: 'Limpar dungeon do pântano negro'
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <View style={GlobalStyle.container}>
      {/* Header Customizado */}
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
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={({ item }) => (
          <View style={[GlobalStyle.listaContainer, { 
            borderColor: '#7C83FD20',
            position: 'relative',
            marginBottom: 16
          }]}>
            <View style={[GlobalStyle.categoryTag, {
              backgroundColor: item.category === 'Dungeon' ? '#FF465520' : '#7C83FD20',
              borderColor: item.category === 'Dungeon' ? '#FF4655' : '#7C83FD'
            }]}>
              <Text style={{ 
                color: item.category === 'Dungeon' ? '#FF4655' : '#7C83FD',
                fontFamily: 'Exo2-SemiBold',
                fontSize: 12
              }}>
                {item.category === 'Dungeon' ? '⚔️ DUNGEON' : '🛡️ DIÁRIA'}
              </Text>
            </View>
            
            <View style={[GlobalStyle.itemLista, { paddingVertical: 20 }]}>
              <Text style={[GlobalStyle.textoItem, { 
                fontSize: 18,
                fontFamily: 'Exo2-SemiBold',
                color: '#E0E5FF',
                marginBottom: 8
              }]}>
                {item.title}
              </Text>

              <Text style={[GlobalStyle.textoItem, {
                color: '#7C83FD',
                fontSize: 14,
                marginBottom: 12
              }]}>
                {item.description}
              </Text>
              
              <View style={{ marginTop: 8 }}>
                <View style={[GlobalStyle.progressBar, { height: 6 }]}>
                  <View style={[GlobalStyle.progressFill, { 
                    width: `${item.progress}%`,
                    backgroundColor: item.progress === 100 ? '#7C83FD' : '#FF4655'
                  }]} />
                </View>
                
                <View style={{ 
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 8
                }}>
                  <Text style={{ 
                    color: '#7C83FD',
                    fontSize: 12,
                    fontFamily: 'Exo2-Italic'
                  }}>
                    {item.progress}% concluído
                  </Text>
                  
                  <TouchableOpacity style={{
                    backgroundColor: item.progress === 100 ? '#7C83FD20' : '#FF465520',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: item.progress === 100 ? '#7C83FD' : '#FF4655'
                  }}>
                    <Text style={{ 
                      color: item.progress === 100 ? '#7C83FD' : '#FF4655',
                      fontSize: 12,
                      fontFamily: 'Orbitron-SemiBold'
                    }}>
                      {item.progress === 100 ? 'RECOMPENSA 🎁' : 'EM ANDAMENTO ⏳'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
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