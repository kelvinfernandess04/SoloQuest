import { StyleSheet } from 'react-native';

export const GlobalStyle = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(2, 17, 60, 0.8)', // Azul escuro semi-transparente
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center', // Centraliza horizontalmente
  },
  titulo: {
    backgroundColor: 'rgba(173, 216, 230, 0.8)', // Azul escuro semi-transparente
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center', // Centraliza verticalmente
  },text: {  // ✅ ADICIONANDO O ESTILO "text" PARA EVITAR ERROS
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  }
});