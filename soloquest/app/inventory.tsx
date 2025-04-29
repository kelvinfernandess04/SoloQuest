import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import {
  InventoryStyles,
  CATEGORY_OPTIONS,
  getCategoryStyle
} from '../styles/InventoryStyles';
import * as dbItemService from '../services/dbItemService';
import { Item } from '../services/dbItemService';

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [newItem, setNewItem] = useState<Omit<Item, 'id'>>({
    name: '',
    category: CATEGORY_OPTIONS[0],
    price: 0,
    owned: true,
    quality: 'Comum'
  });
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  const loadItems = async () => {
    try {
      await dbItemService.createTable();
      const dbItems = await dbItemService.readItem();
      setItems(dbItems);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.name.trim()) return;

    const itemToAdd: Item = {
      ...newItem,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2,5)
    };

    try {
      const success = await dbItemService.createItem(itemToAdd);
      if (success) {
        setItems(prev => [...prev, itemToAdd]);
        setNewItem({
          name: '',
          category: CATEGORY_OPTIONS[0],
          price: 0,
          owned: true,
          quality: 'Comum'
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const success = await dbItemService.deleteItem(id);
      if (success) {
        setItems(prev => prev.filter(i => i.id !== id));
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const filteredItems = items.filter(i =>
    selectedFilter === 'Todos' ? true : i.category === selectedFilter
  );

  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.titulo}>Tesouro do Caçador</Text>

      {/* Formulário de adição */}
      <View style={InventoryStyles.formContainer}>
        <TextInput
          style={InventoryStyles.input}
          placeholder="Nome do item"
          placeholderTextColor="#7C83FD80"
          value={newItem.name}
          onChangeText={text => setNewItem({ ...newItem, name: text })}
        />

        <TextInput
          style={InventoryStyles.input}
          placeholder="Preço"
          placeholderTextColor="#7C83FD80"
          keyboardType="numeric"
          value={newItem.price > 0 ? newItem.price.toString() : ''}
          onChangeText={text => setNewItem({ ...newItem, price: Number(text) || 0 })}
        />

        <TouchableOpacity
          style={InventoryStyles.categorySelector}
          onPress={() => setShowCategorySelector(true)}
        >
          <Text style={InventoryStyles.categorySelectorText}>
            Categoria: {newItem.category}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            InventoryStyles.addButton,
            !newItem.name.trim() && InventoryStyles.disabledButton
          ]}
          onPress={handleAddItem}
          disabled={!newItem.name.trim()}
        >
          <Text style={InventoryStyles.addButtonText}>Adicionar Item</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de seleção de categoria */}
      <Modal
        visible={showCategorySelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategorySelector(false)}
      >
        <View style={InventoryStyles.modalOverlay}>
          <View style={InventoryStyles.modalContent}>
            <Text style={InventoryStyles.modalTitle}>Selecione a Categoria</Text>
            <ScrollView>
              {CATEGORY_OPTIONS.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    InventoryStyles.categoryOption,
                    newItem.category === cat && InventoryStyles.categoryOptionSelected
                  ]}
                  onPress={() => {
                    setNewItem({ ...newItem, category: cat });
                    setShowCategorySelector(false);
                  }}
                >
                  <Text style={InventoryStyles.categoryOptionText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={InventoryStyles.modalCloseButton}
              onPress={() => setShowCategorySelector(false)}
            >
              <Text style={InventoryStyles.modalCloseButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Filtro de categorias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={InventoryStyles.filterContainer}
      >
        <TouchableOpacity
          style={[
            InventoryStyles.filterButton,
            selectedFilter === 'Todos' && InventoryStyles.filterButtonSelected
          ]}
          onPress={() => setSelectedFilter('Todos')}
        >
          <Text style={InventoryStyles.filterButtonText}>Todos</Text>
        </TouchableOpacity>
        {CATEGORY_OPTIONS.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              InventoryStyles.filterButton,
              selectedFilter === cat && InventoryStyles.filterButtonSelected
            ]}
            onPress={() => setSelectedFilter(cat)}
          >
            <Text style={InventoryStyles.filterButtonText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de itens */}
      <FlatList
        data={filteredItems.filter(item => item.owned)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={GlobalStyle.rewardCard}>
            {/* Badge de qualidade */}
            <View style={InventoryStyles.qualityTag}>
              <Text style={InventoryStyles.qualityTagText}>{item.quality}</Text>
            </View>

            {/* Badge de categoria */}
            <View style={[GlobalStyle.categoryTag, getCategoryStyle(item.category)]}>
              <Text
                style={{
                  color: getCategoryStyle(item.category).borderColor,
                  fontSize: 12
                }}
              >
                {item.category}
              </Text>
            </View>

            <Text
              style={{
                color: '#E0E5FF',
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 8
              }}
            >
              {item.name}
            </Text>

            <Text style={{ color: '#7C83FD', marginBottom: 8 }}>
              Preço: <Text style={{ color: '#E0E5FF' }}>{item.price} moedas</Text>
            </Text>

            <TouchableOpacity
              style={InventoryStyles.deleteButton}
              onPress={() => handleDeleteItem(item.id)}
            >
              <Text style={InventoryStyles.deleteButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
