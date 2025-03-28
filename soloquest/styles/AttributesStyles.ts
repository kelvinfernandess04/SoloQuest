import { StyleSheet } from 'react-native';

export const AttributesStyles = StyleSheet.create({
  attributeContainer: {
    backgroundColor: '#161B33',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#7C83FD40',
  },
  attributeTitle: {
    color: '#FED053',
    fontSize: 20,
    fontFamily: 'Orbitron-SemiBold',
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#2A2F4D',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7C83FD',
  }
});