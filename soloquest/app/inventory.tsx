import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet, Alert } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import * as dbItemService from '../services/dbItemService';
import * as dbCategoryService from '../services/dbCategoryService';

export default function Inventory() {
  const [items, setItems] = useState<dbItemService.Item[]>([]);
  const [categories, setCategories] = useState<dbCategoryService.Category[]>([]);
  const [newItem, setNewItem] = useState<Omit<dbItemService.Item, 'id'>>({ 
    name: '', 
    category: { id: '', name: '', color: '#FFFFFF' },
    price: 0,
    owned: false 
  });
  const [newCategory, setNewCategory] = useState<Omit<dbCategoryService.Category, 'id'>>({
    name: '',
    color: '#7C83FD'
  });
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const loadData = async () => {
    try {
      await dbCategoryService.createCategoriesTable();
      await dbItemService.createTable();
      
      const loadedCategories = await dbCategoryService.readCategories();
      const loadedItems = await dbItemService.readItem();
      
      setCategories(loadedCategories);
      setItems(loadedItems);
      
      if (loadedCategories.length > 0) {
        setNewItem(prev => ({
          ...prev,
          category: loadedCategories[0]
        }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.name.trim()) {
      Alert.alert('Atenção', 'Digite um nome para o item');
      return;
    }

    if (!newItem.category.id) {
      Alert.alert('Atenção', 'Selecione uma categoria');
      return;
    }

    try {
      const itemToAdd = {
        ...newItem,
        id: Math.random().toString(36).substring(7)
      };
      
      const success = await dbItemService.createItem(itemToAdd);
      
      if (success) {
        setItems([...items, itemToAdd]);
        setNewItem({ 
          name: '', 
          category: categories.length > 0 ? categories[0] : { id: '', name: '', color: '#FFFFFF' },
          price: 0, 
          owned: false 
        });
      }
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o item');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      Alert.alert('Atenção', 'Digite um nome para a categoria');
      return;
    }

    try {
      const categoryToAdd = {
        ...newCategory,
        id: Math.random().toString(36).substring(7)
      };
      
      const success = await dbCategoryService.createCategory(categoryToAdd);
      
      if (success) {
        setCategories([...categories, categoryToAdd]);
        setNewCategory({ name: '', color: '#7C83FD' });
        setShowAddCategoryModal(false);
        
        // Se era a primeira categoria, atualiza o novo item
        if (categories.length === 0) {
          setNewItem(prev => ({
            ...prev,
            category: categoryToAdd
          }));
        }
      }
    } catch (error) {
      console.error('Error adding category:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a categoria');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const success = await dbItemService.deleteItem(id);
      if (success) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Erro', 'Não foi possível remover o item');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    // Verifica se a categoria está em uso
    const isInUse = items.some(item => item.category.id === id);
    
    if (isInUse) {
      Alert.alert(
        'Categoria em uso',
        'Esta categoria está sendo usada por algum item e não pode ser removida.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    try {
      const success = await dbCategoryService.deleteCategory(id);
      if (success) {
        setCategories(categories.filter(cat => cat.id !== id));
        
        // Se a categoria removida era a selecionada, seleciona a primeira disponível
        if (newItem.category.id === id) {
          setNewItem(prev => ({
            ...prev,
            category: categories.length > 1 ? 
              categories.find(c => c.id !== id) || { id: '', name: '', color: '#FFFFFF' } : 
              { id: '', name: '', color: '#FFFFFF' }
          }));
        }
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      Alert.alert('Erro', 'Não foi possível remover a categoria');
    }
  };

  const getCategoryStyle = (category: dbCategoryService.Category) => {
    return { 
      backgroundColor: `${category.color}20`, 
      borderColor: category.color 
    };
  };

  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.titulo}>Tesouro do Caçador</Text>
      
      {/* Botão para gerenciar categorias */}
      <TouchableOpacity
        style={styles.manageCategoriesButton}
        onPress={() => setShowAddCategoryModal(true)}
      >
        <Text style={styles.manageCategoriesButtonText}>Gerenciar Categorias</Text>
      </TouchableOpacity>
      
      {/* Formulário de adição de item */}
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
          disabled={categories.length === 0}
        >
          <Text style={[styles.categorySelectorText, categories.length === 0 && { color: '#7C83FD80' }]}>
            {categories.length > 0 ? `Categoria: ${newItem.category.name}` : 'Nenhuma categoria disponível'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.addButton, (!newItem.name.trim() || categories.length === 0) && styles.disabledButton]}
          onPress={handleAddItem}
          disabled={!newItem.name.trim() || categories.length === 0}
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
            
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryOption,
                  newItem.category.id === category.id && styles.categoryOptionSelected,
                  { borderColor: category.color }
                ]}
                onPress={() => {
                  setNewItem({...newItem, category});
                  setShowCategoryModal(false);
                }}
              >
                <View style={[styles.categoryColorIndicator, { backgroundColor: category.color }]} />
                <Text style={styles.categoryOptionText}>{category.name}</Text>
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
      
      {/* Modal de Adição de Categoria */}
      <Modal
        visible={showAddCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Gerenciar Categorias</Text>
            
            {/* Formulário para nova categoria */}
            <TextInput
              style={styles.input}
              placeholder="Nome da categoria"
              placeholderTextColor="#7C83FD80"
              value={newCategory.name}
              onChangeText={text => setNewCategory({...newCategory, name: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Cor (ex: #FF4655)"
              placeholderTextColor="#7C83FD80"
              value={newCategory.color}
              onChangeText={text => setNewCategory({...newCategory, color: text})}
            />
            
            <TouchableOpacity
              style={[styles.addButton, !newCategory.name.trim() && styles.disabledButton]}
              onPress={handleAddCategory}
              disabled={!newCategory.name.trim()}
            >
              <Text style={styles.addButtonText}>Adicionar Categoria</Text>
            </TouchableOpacity>
            
            {/* Lista de categorias existentes */}
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.categoryItem, { borderColor: item.color }]}>
                  <View style={[styles.categoryColorIndicator, { backgroundColor: item.color }]} />
                  <Text style={styles.categoryItemText}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteCategory(item.id)}
                  >
                    <Text style={{ color: '#FF4655' }}>Remover</Text>
                  </TouchableOpacity>
                </View>
              )}
              style={{ maxHeight: 200, marginTop: 16 }}
            />
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAddCategoryModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Fechar</Text>
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
              <Text style={{ color: item.category.color, fontSize: 12 }}>
                {item.category.name}
              </Text>
            </View>
            
            <Text style={{ color: '#E0E5FF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
              {item.name}
            </Text>
            
            <Text style={{ color: '#7C83FD', marginBottom: 8 }}>
              Preço: <Text style={{ color: '#E0E5FF' }}>{item.price} moedas</Text>
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ 
                color: item.owned ? '#4CAF50' : '#FF4655',
                alignSelf: 'center'
              }}>
                {item.owned ? 'Possuído' : 'Não Possuído'}
              </Text>
              
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#0A0F24',
    borderWidth: 1
  },
  categoryOptionSelected: {
    backgroundColor: '#7C83FD30'
  },
  categoryOptionText: {
    color: '#E0E5FF',
    marginLeft: 12,
    flex: 1
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
  manageCategoriesButton: {
    backgroundColor: '#2A2F4D',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7C83FD30'
  },
  manageCategoriesButtonText: {
    color: '#7C83FD',
    fontWeight: 'bold'
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#0A0F24',
    borderWidth: 1
  },
  categoryColorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  categoryItemText: {
    marginLeft: 12,
    flex: 1,
    color: '#E0E5FF'
  }
});