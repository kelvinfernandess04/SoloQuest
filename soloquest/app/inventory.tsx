import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet, ScrollView } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import * as dbItemService from '../services/dbItemService';
import * as dbItemCategoryService from '../services/dbItemCategoryService';

// Removemos o enum fixo e passamos a usar as categorias do banco
export interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  owned: boolean;
}

interface ItemCategory {
  id: string;
  name: string;
}

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [newItem, setNewItem] = useState<Omit<Item, 'id'>>({
    name: '',
    category: '',
    price: 0,
    owned: true
  });
  const [showCategorySelectorModal, setShowCategorySelectorModal] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const loadItems = async () => {
    try {
      await dbItemService.createTable();
      const dbItems = await dbItemService.readItem();
      setItems(dbItems as Item[]);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    }
  };

  const loadCategories = async () => {
    try {
      await dbItemCategoryService.createTable();
      const dbCategories = await dbItemCategoryService.readCategories();
      setCategories(dbCategories);
      // Se ainda não foi selecionada nenhuma categoria para o novo item e houver alguma cadastrada, define a primeira como padrão
      if (!newItem.category && dbCategories.length > 0) {
        setNewItem({ ...newItem, category: dbCategories[0].name });
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadAll = async () => {
    await loadItems();
    await loadCategories();
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !newItem.category.trim()) return;

    try {
      const itemToAdd = {
        ...newItem,
        id: Math.random().toString(36).substring(7)
      };

      const success = await dbItemService.createItem(itemToAdd);
      if (success) {
        setItems([...items, itemToAdd]);
        setNewItem({ name: '', category: categories[0]?.name || '', price: 0, owned: true });
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

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const newCategory = {
        id: Math.random().toString(36).substring(7),
        name: newCategoryName.trim()
      };
      const success = await dbItemCategoryService.createCategory(newCategory);
      if (success) {
        setCategories([...categories, newCategory]);
        // Se não houver categoria selecionada para o novo item, define a nova como padrão
        if (!newItem.category) {
          setNewItem({ ...newItem, category: newCategory.name });
        }
        setNewCategoryName('');
        setShowNewCategoryModal(false);
      }
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
    }
  };

  // Função de filtro dos itens por categoria
  const filteredItems = items.filter(item => {
    if (selectedFilter === 'Todos') return true;
    return item.category === selectedFilter;
  });

  // Função para renderizar o estilo de cada categoria (simples exemplo)
  const getCategoryStyle = (category: string) => {
    // Tenta encontrar a categoria cadastrada para buscar alguma cor definida
    const cat = categories.find(c => c.name === category);
    // Se não encontrar, retorna um estilo padrão
    if (!cat) return { backgroundColor: '#607D8B20', borderColor: '#607D8B' };

    // Exemplo: se o nome contiver "Arma" ou "Armadura" ou "Acessório", pode retornar cores diferentes
    if (cat.name.toLowerCase().includes("arma")) {
      return { backgroundColor: '#FF465520', borderColor: '#FF4655' };
    } else if (cat.name.toLowerCase().includes("armadura")) {
      return { backgroundColor: '#4CAF5020', borderColor: '#4CAF50' };
    } else if (cat.name.toLowerCase().includes("acessório")) {
      return { backgroundColor: '#9C27B020', borderColor: '#9C27B0' };
    }
    return { backgroundColor: '#607D8B20', borderColor: '#607D8B' };
  };

  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.titulo}>Tesouro do Caçador</Text>

      {/* Formulário de adição de item */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome do item"
          placeholderTextColor="#7C83FD80"
          value={newItem.name}
          onChangeText={text => setNewItem({ ...newItem, name: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Preço"
          placeholderTextColor="#7C83FD80"
          keyboardType="numeric"
          value={newItem.price > 0 ? newItem.price.toString() : ''}
          onChangeText={text => setNewItem({ ...newItem, price: Number(text) || 0 })}
        />

        {/* Seletor de Categoria para o item */}
        <TouchableOpacity
          style={styles.categorySelector}
          onPress={() => setShowCategorySelectorModal(true)}
        >
          <Text style={styles.categorySelectorText}>
            Categoria: {newItem.category || 'Selecione'}
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

      {/* Modal de Seleção de Categoria para o item */}
      <Modal
        visible={showCategorySelectorModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategorySelectorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a Categoria</Text>
            <ScrollView>
              <TouchableOpacity
                style={[
                  styles.categoryOption,
                  selectedFilter === 'Todos' && styles.categoryOptionSelected
                ]}
                onPress={() => {
                  setNewItem({ ...newItem, category: '' });
                  setShowCategorySelectorModal(false);
                }}
              >
                <Text style={styles.categoryOptionText}>Nenhuma / Padrão</Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    newItem.category === category.name && styles.categoryOptionSelected
                  ]}
                  onPress={() => {
                    setNewItem({ ...newItem, category: category.name });
                    setShowCategorySelectorModal(false);
                  }}
                >
                  <Text style={styles.categoryOptionText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.addCategoryButton}
              onPress={() => {
                setShowCategorySelectorModal(false);
                setShowNewCategoryModal(true);
              }}
            >
              <Text style={styles.addCategoryButtonText}>+ Adicionar Nova Categoria</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCategorySelectorModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para cadastro de nova categoria */}
      <Modal
        visible={showNewCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNewCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Categoria</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da categoria"
              placeholderTextColor="#7C83FD80"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddCategory}
            >
              <Text style={styles.addButtonText}>Adicionar Categoria</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowNewCategoryModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Filtro de Categorias para itens */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'Todos' && styles.filterButtonSelected
          ]}
          onPress={() => setSelectedFilter('Todos')}
        >
          <Text style={styles.filterButtonText}>Todos</Text>
        </TouchableOpacity>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.filterButton,
              selectedFilter === category.name && styles.filterButtonSelected
            ]}
            onPress={() => setSelectedFilter(category.name)}
          >
            <Text style={styles.filterButtonText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de Itens */}
      <FlatList
        data={filteredItems.filter(item => item.owned)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={GlobalStyle.rewardCard}>
            <View style={[GlobalStyle.categoryTag, getCategoryStyle(item.category)]}>
              <Text style={{ color: getCategoryStyle(item.category).borderColor, fontSize: 12 }}>
                {item.category || 'Padrão'}
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
  },
  addCategoryButton: {
    backgroundColor: '#7C83FD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
  addCategoryButtonText: {
    color: '#E0E5FF',
    fontWeight: 'bold'
  },
  filterContainer: {
    marginBottom: 12
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#0A0F24',
    borderWidth: 1,
    borderColor: '#2A2F4D',
    marginRight: 8
  },
  filterButtonSelected: {
    backgroundColor: '#7C83FD'
  },
  filterButtonText: {
    color: '#E0E5FF'
  }
});
