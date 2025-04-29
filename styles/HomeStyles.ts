import { StyleSheet } from 'react-native';

export const HomeStyles = StyleSheet.create({
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
  headerButton: {
    backgroundColor: '#2A2F4D',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  headerButtonAlt: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  listaContainer: {
    backgroundColor: '#161B33',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2F4D',
  },
  questContainer: {
    borderColor: '#7C83FD20',
    position: 'relative',
    marginBottom: 16
  },
  questContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  itemLista: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F4D',
  },
  textoItem: {
    fontSize: 16,
    color: '#C0C5FF',
    fontFamily: 'Exo2-Regular',
  },
  questName: {
    fontSize: 18,
    fontFamily: 'Exo2-SemiBold',
    color: '#E0E5FF',
    marginBottom: 8
  },
  questInfo: {
    color: '#7C83FD',
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
    backgroundColor: '#FF465520',
    borderRadius: 8
  },
  deleteButtonText: {
    color: '#FF4655', 
    fontFamily: 'Orbitron-SemiBold',
    fontSize: 12
  }
});