import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';

export default function CreateTaskScreen({ navigation }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { id: 'daily', label: 'Missão Diária', emoji: '🛡️' },
    { id: 'dungeon', label: 'Dungeon', emoji: '⚔️' },
  ];

  return (
    <LinearGradient
      colors={['#0A0A1A', '#1A1A2F']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NOVA MISSÃO</Text>
        <View style={{ width: 30 }} /> {/* Espaçamento */}
      </View>
      
      {/* Formulário */}
      <View style={styles.formContainer}>
        {/* Campo Título */}
        <Text style={styles.label}>Título da Missão</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Estudar por 2 horas"
          placeholderTextColor="#6A00FF"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />

        {/* Seletor de Categoria */}
        <Text style={styles.label}>Tipo de Missão</Text>
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categorySelected
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <LinearGradient
                colors={
                  selectedCategory === category.id 
                    ? ['#6A00FF', '#00F3FF'] 
                    : ['transparent', 'transparent']
                }
                style={styles.categoryGradient}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão de Criação */}
        <TouchableOpacity style={styles.createButton}>
          <LinearGradient
            colors={['#6A00FF', '#00F3FF']}
            style={styles.createButtonGradient}
          >
            <Text style={styles.createButtonText}>CRIAR MISSÃO</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  backButton: {
    color: '#00F3FF',
    fontSize: 40,
    lineHeight: 40,
  },
  headerTitle: {
    color: '#00F3FF',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 243, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  formContainer: {
    paddingHorizontal: 25,
  },
  label: {
    color: '#E0E0E0',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#6A00FF',
    borderRadius: 8,
    padding: 15,
    color: '#E0E0E0',
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 10,
  },
  categoryButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6A00FF',
    overflow: 'hidden',
  },
  categoryGradient: {
    padding: 15,
    alignItems: 'center',
  },
  categorySelected: {
    borderColor: '#00F3FF',
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryLabel: {
    color: '#E0E0E0',
    fontSize: 14,
    textAlign: 'center',
  },
  createButton: {
    marginTop: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },
  createButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});