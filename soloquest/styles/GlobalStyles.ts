import { StyleSheet } from 'react-native';

export const GlobalStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F24', // Azul escuro profundo
    padding: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0E5FF', // Azul claro neon
    marginBottom: 24,
    fontFamily: 'Cinzel-Bold',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#0A0F24',
    borderBottomWidth: 1,
    borderBottomColor: '#7C83FD30',
  },
  headerTitle: {
    color: '#7C83FD',
    fontSize: 20,
    fontFamily: 'Orbitron-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerButton: {
    backgroundColor: '#2A2F4D', // Azul acinzentado
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  listaContainer: {
    backgroundColor: '#161B33', // Azul escuro
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2F4D',
  },
  itemLista: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F4D',
  },
  textoItem: {
    fontSize: 16,
    color: '#C0C5FF', // Azul claro
    fontFamily: 'Exo2-Regular',
  },
  botaoAdicionar: {
    backgroundColor: '#4E54C8', // Roxo-azulado vibrante
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    backgroundColor: '#1A1F3A',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    color: '#E0E5FF',
    borderWidth: 1,
    borderColor: '#2A2F4D',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: '#2A2F4D',
    backgroundColor: '#121833',
    width: "100%"
  },
  navButton: {
    alignItems: 'center',
    padding: 10,
  },
  navText: {
    color: '#7C83FD',
    fontSize: 14,
    marginTop: 4,
  }, attributeContainer: {
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
  },
  categoryTag: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FF465520',
    borderWidth: 1,
    borderColor: '#FF4655',
  },
  rewardCard: {
    backgroundColor: '#161B33',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#7C83FD30',
  }
});