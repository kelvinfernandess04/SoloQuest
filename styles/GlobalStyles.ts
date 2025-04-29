import { StyleSheet } from 'react-native';

export const GlobalStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F24',
    padding: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0E5FF',
    marginBottom: 24,
    fontFamily: 'Cinzel-Bold',
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