import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';

// Enum para as categorias de itens
enum ItemCategory {
  Weapon = "Arma",
  Armor = "Armadura",
  Acessorie = "Acessório"
}

interface Item {
  id: string;
  name: string;
  category: ItemCategory; // Usando o enum como tipo
  price: number;
  owned: boolean;
}

export default function Store() {
  // Exemplo de uso
  const sampleItems: Item[] = [
    {
      id: '1',
      name: 'Espada Longa',
      category: ItemCategory.Weapon,
      price: 150,
      owned: false
    },
    {
      id: '2',
      name: 'Poção de Cura',
      category: ItemCategory.Acessorie,
      price: 50,
      owned: true
    }
  ];

  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.titulo}>Tesouro do Caçador</Text>
      
      <FlatList
        data={sampleItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>Categoria: {item.category}</Text>
            <Text>Preço: {item.price} moedas</Text>
            <Text>{item.owned ? 'Possuído' : 'Não possuído'}</Text>
          </View>
        )}
      />
    </View>
  );
}