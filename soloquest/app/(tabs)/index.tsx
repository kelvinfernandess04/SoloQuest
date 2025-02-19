import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#0A0A1A', '#1A1A2F']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DAILY QUESTS</Text>
        <View style={styles.currencyContainer}>
          <Text style={styles.currency}>🪙 1500</Text>
          <Text style={styles.currency}>✨ 320 XP</Text>
        </View>
      </View>

      {/* Lista de Tarefas */}
      <ScrollView style={styles.taskList}>
        {/* Exemplo de Tarefa */}
        <LinearGradient
          colors={['rgba(106, 0, 255, 0.3)', 'transparent']}
          style={styles.taskCard}
        >
          <Text style={styles.taskCategory}>⚔️ Dungeon</Text>
          <Text style={styles.taskTitle}>Estudar React Native</Text>
          <TouchableOpacity style={styles.completeButton}>
            <LinearGradient
              colors={['#6A00FF', '#00F3FF']}
              style={styles.completeButtonGradient}
            >
              <Text style={styles.completeButtonText}>CONCLUIR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>

      {/* Botão Flutuante */}
      <TouchableOpacity style={styles.addButton}>
        <LinearGradient
          colors={['#6A00FF', '#00F3FF']}
          style={styles.addButtonGradient}
        >
          <Text style={styles.addButtonText}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00F3FF',
    textShadowColor: 'rgba(0, 243, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  currencyContainer: {
    gap: 10,
    backgroundColor: 'transparent',
  },
  currency: {
    color: '#E0E0E0',
    fontSize: 16,
  },
  taskList: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  taskCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(106, 0, 255, 0.5)',
  },
  taskCategory: {
    color: '#6A00FF',
    fontSize: 14,
    marginBottom: 8,
  },
  taskTitle: {
    color: '#E0E0E0',
    fontSize: 18,
    marginBottom: 15,
  },
  completeButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  completeButtonGradient: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 30,
    overflow: 'hidden',
  },
  addButtonGradient: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
});