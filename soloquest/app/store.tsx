import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import * as dbItemService from '../services/dbItemService';

enum ItemCategory {
  Weapon = "Arma",
  Armor = "Armadura",
  Acessorie = "Acessório"
}

interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  owned: boolean;
}

export default function Store() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<Omit<Item, 'id'>>({ 
    name: '', 
    category: ItemCategory.Weapon,
    price: 0,
    owned: false 
  });

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
        setNewItem({ name: '', category: ItemCategory.Weapon, price: 0, owned: false });
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  const handleToggleOwned = async (item: Item) => {
    try {
      const updatedItem = { ...item, owned: !item.owned };
      const success = await dbItemService.updateItem({
        ...updatedItem,
        category: updatedItem.category.toString()
      });
      
      if (success) {
        setItems(items.map(i => i.id === item.id ? updatedItem : i));
      }
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
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
      <View style={{ 
        backgroundColor: '#161B33', 
        padding: 16, 
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#7C83FD30'
      }}>
        <TextInput
          style={{
            color: '#E0E5FF',
            backgroundColor: '#0A0F24',
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: '#2A2F4D'
          }}
          placeholder="Nome do item"
          placeholderTextColor="#7C83FD80"
          value={newItem.name}
          onChangeText={text => setNewItem({...newItem, name: text})}
        />
        
        <TextInput
          style={{
            color: '#E0E5FF',
            backgroundColor: '#0A0F24',
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: '#2A2F4D'
          }}
          placeholder="Preço"
          placeholderTextColor="#7C83FD80"
          keyboardType="numeric"
          value={newItem.price.toString()}
          onChangeText={text => setNewItem({...newItem, price: Number(text) || 0})}
        />
        
        <TouchableOpacity
          style={{
            backgroundColor: '#7C83FD',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center'
          }}
          onPress={handleAddItem}
        >
          <Text style={{ color: '#E0E5FF', fontWeight: 'bold' }}>Adicionar Item</Text>
        </TouchableOpacity>
      </View>
      
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
                  backgroundColor: item.owned ? '#2A2F4D' : '#7C83FD',
                  padding: 8,
                  borderRadius: 6,
                  flex: 1,
                  marginRight: 8
                }}
                onPress={() => handleToggleOwned(item)}
              >
                <Text style={{ color: '#E0E5FF', textAlign: 'center' }}>
                  {item.owned ? 'Possuído' : 'Não Possuído'}
                </Text>
              </TouchableOpacity>
              
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