import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import * as dbItemService from '../services/dbItemService';

export enum ItemCategory {
  Weapon = "Arma",
  Armor = "Armadura",
  Acessorie = "Acessório"
}

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  owned: boolean;
}

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<Omit<Item, 'id'>>({ 
    name: '', 
    category: ItemCategory.Weapon,
    price: 0,
    owned: true 
  });
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const loadItems = async () => {
    try {
      await dbItemService.createTable();
      const dbItems = await dbItemService.readItem();
      setItems(dbItems as Item[]);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.name.trim()) return;
    
    try {
      const itemToAdd = {
        ...newItem,
        id: Math.random().toString(36).substring(7)
      };
      
      const success = await dbItemService.createItem({
        ...itemToAdd,
        category: itemToAdd.category.toString()
      });
      
      if (success) {
        setItems([...items, itemToAdd]);
        setNewItem({ name: '', category: ItemCategory.Weapon, price: 0, owned: true });
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };


  const handleDeleteItem = async (id: string) => {
    try {
      const success = await dbItemService.deleteItem(id);
      if (success) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const getCategoryStyle = (category: ItemCategory) => {
    switch(category) {
      case ItemCategory.Weapon:
        return { backgroundColor: '#FF465520', borderColor: '#FF4655' };
      case ItemCategory.Armor:
        return { backgroundColor: '#4CAF5020', borderColor: '#4CAF50' };
      case ItemCategory.Acessorie:
        return { backgroundColor: '#9C27B020', borderColor: '#9C27B0' };
      default:
        return { backgroundColor: '#607D8B20', borderColor: '#607D8B' };
    }
  };

  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.titulo}>Tesouro do Caçador</Text>
      
      {/* Formulário de adição */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome do item"
          placeholderTextColor="#7C83FD80"
          value={newItem.name}
          onChangeText={text => setNewItem({...newItem, name: text})}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Preço"
          placeholderTextColor="#7C83FD80"
          keyboardType="numeric"
          value={newItem.price > 0 ? newItem.price.toString() : ''}
          onChangeText={text => setNewItem({...newItem, price: Number(text) || 0})}
        />
        
        {/* Seletor de Categoria */}
        <TouchableOpacity 
          style={styles.categorySelector}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.categorySelectorText}>
            Categoria: {newItem.category}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.addButton, !newItem.name.trim() && styles.disabledButton]}
          onPress={handleAddItem}
          disabled={!newItem.name.trim()}
        >
          <Text style={styles.addButtonText}>Adicionar Item</Text>
        </TouchableOpacity>
      </View>
      
      {/* Modal de Seleção de Categoria */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a Categoria</Text>
            
            {Object.values(ItemCategory).map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryOption,
                  newItem.category === category && styles.categoryOptionSelected
                ]}
                onPress={() => {
                  setNewItem({...newItem, category});
                  setShowCategoryModal(false);
                }}
              >
                <Text style={styles.categoryOptionText}>{category}</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Lista de itens */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={GlobalStyle.rewardCard}>
            <View style={[GlobalStyle.categoryTag, getCategoryStyle(item.category)]}>
              <Text style={{ color: getCategoryStyle(item.category).borderColor, fontSize: 12 }}>
                {item.category}
              </Text>
            </View>
            
            <Text style={{ color: '#E0E5FF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
              {item.name}
            </Text>
            
            <Text style={{ color: '#7C83FD', marginBottom: 8 }}>
              Preço: <Text style={{ color: '#E0E5FF' }}>{item.price} moedas</Text>
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            
              <TouchableOpacity
                style={{
                  backgroundColor: '#FF465520',
                  padding: 8,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#FF4655'
                }}
                onPress={() => handleDeleteItem(item.id)}
              >
                <Text style={{ color: '#FF4655', textAlign: 'center' }}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    padding: 12,
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
  }
});