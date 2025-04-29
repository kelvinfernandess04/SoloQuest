// src/styles/StoreStyles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  tabButton: {
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center'
  },
  tabText: {
    color: '#E0E5FF',
    fontWeight: 'bold'
  },
  sectionTitle: {
    color: '#7C83FD',
    fontSize: 20,
    marginVertical: 10,
    fontFamily: 'Cinzel-Bold'
  },
  buyButton: {
    backgroundColor: '#4CAF5050',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50'
  },
  sellButton: {
    backgroundColor: '#9C27B050',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9C27B0'
  },
  buttonText: {
    color: '#E0E5FF',
    fontWeight: '600'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0A0F24',
    padding: 20,
    justifyContent: 'center'
  },
  modalTitle: {
    color: '#E0E5FF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F4D'
  },
  cartText: {
    color: '#E0E5FF',
    fontSize: 16
  },
  removeText: {
    color: '#FF4655',
    fontSize: 20
  },
  totalText: {
    color: '#7C83FD',
    fontSize: 20,
    textAlign: 'right',
    margin: 15,
    fontFamily: 'Orbitron-SemiBold'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  },
  cancelButton: {
    backgroundColor: '#FF465550',
    padding: 15,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF4655'
  },
  checkoutButton: {
    backgroundColor: '#7C83FD',
    padding: 15,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center'
  },
  historyContainer: {
    flex: 1,
    backgroundColor: '#0A0F24',
    padding: 20
  },
  historyTitle: {
    color: '#E0E5FF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  transactionItem: {
    backgroundColor: '#161B33',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  transactionDate: {
    color: '#E0E5FF',
    fontSize: 16,
    fontWeight: '600'
  },
  transactionTotal: {
    color: '#7C83FD',
    fontSize: 16,
    fontWeight: '600'
  },
  transactionItems: {
    color: '#A3A3A3',
    fontSize: 14
  },
  closeButton: {
    backgroundColor: '#7C83FD',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center'
  },
  sectionItemName: {
    color: '#E0E5FF',
    fontSize: 18,
    marginBottom: 8
  },
  sectionItemPrice: {
    color: '#7C83FD',
    marginBottom: 8
  }
});
