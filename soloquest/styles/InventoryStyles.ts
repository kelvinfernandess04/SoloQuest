// styles/InventoryStyles.ts
import { StyleSheet } from 'react-native';

export const CATEGORY_OPTIONS = ['Arma', 'Armadura', 'Acessório'];

export const getCategoryStyle = (category: string) => {
  const lower = category.toLowerCase();
  if (lower.includes('arma')) return { backgroundColor: '#FF465520', borderColor: '#FF4655' };
  if (lower.includes('armadura')) return { backgroundColor: '#4CAF5020', borderColor: '#4CAF50' };
  if (lower.includes('acessório')) return { backgroundColor: '#9C27B020', borderColor: '#9C27B0' };
  return { backgroundColor: '#607D8B20', borderColor: '#607D8B' };
};

export const InventoryStyles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#161B33',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#7C83FD30'
  },
  input: {
    color: '#E0E5FF',
    backgroundColor: '#0A0F24',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2F4D'
  },
  categorySelector: {
    backgroundColor: '#0A0F24',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2F4D'
  },
  categorySelectorText: {
    color: '#E0E5FF'
  },
  addButton: {
    backgroundColor: '#7C83FD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  disabledButton: {
    opacity: 0.6
  },
  addButtonText: {
    color: '#E0E5FF',
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 15, 36, 0.8)',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#161B33',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#7C83FD30'
  },
  modalTitle: {
    color: '#E0E5FF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  categoryOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#0A0F24'
  },
  categoryOptionSelected: {
    backgroundColor: '#7C83FD30',
    borderWidth: 1,
    borderColor: '#7C83FD'
  },
  categoryOptionText: {
    color: '#E0E5FF',
    textAlign: 'center'
  },
  modalCloseButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FF465520',
    borderWidth: 1,
    borderColor: '#FF4655'
  },
  modalCloseButtonText: {
    color: '#FF4655',
    textAlign: 'center'
  },
  filterContainer: {
    marginVertical: 10,
    paddingHorizontal: 15
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#0A0F24',
    borderWidth: 1,
    borderColor: '#2A2F4D',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',    
    height: 50
  },
  filterButtonSelected: {
    backgroundColor: '#7C83FD',
    height: 55
  },
  filterButtonText: {
    color: '#E0E5FF',
    fontSize: 14,
    textAlign: 'center'
  },
  deleteButton: {
    backgroundColor: '#FF465520',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF4655',
    marginTop: 8
  },
  deleteButtonText: {
    color: '#FF4655',
    textAlign: 'center'
  },
  qualityTag: {
    position: 'absolute',
    left: '90%', // Centraliza horizontalmente
    top: 16, // Mantém a posição no topo
    transform: 'translateX(-50%)', // Ajusta para o centro corretamente
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FFD70030',
    borderWidth: 1,
    borderColor: '#FFD700',
    zIndex: 10
  },
  qualityTagText: {
    color: '#FFD700',
    fontSize: 12
  }
});
