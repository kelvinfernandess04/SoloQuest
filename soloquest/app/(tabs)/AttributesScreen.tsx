import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function AttributesScreen() {
  return (
    <LinearGradient colors={['#0A0A1A', '#1A1A2F']} style={styles.container}>
      <Text style={styles.title}>STATUS</Text>
      
      {/* Exemplo de Atributo */}
      <View style={styles.attributeContainer}>
        <Text style={styles.attributeLabel}>INTELIGÊNCIA ✨</Text>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#6A00FF', '#00F3FF']}
            style={[styles.progressFill, { width: '70%' }]}
          />
        </View>
        <Text style={styles.attributeValue}>70/100</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#00F3FF',
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
  },
  attributeContainer: {
    marginBottom: 25,
    backgroundColor: 'rgba(106, 0, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6A00FF',
  },
  attributeLabel: {
    color: '#E0E0E0',
    fontSize: 16,
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  attributeValue: {
    color: '#00F3FF',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'right',
  },
});