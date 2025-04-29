// src/screens/Store.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert
} from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import styles from '../styles/StoreStyles';
import * as dbItemService from '../services/dbItemService';
import * as dbStoreService from '../services/dbStoreService';
import { Item } from '../services/dbItemService';
import { usePlayer } from '../contexts/PlayerContext';

export default function Store() {
  const [storeItems, setStoreItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<Item[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const { addCoins, spendCoins } = usePlayer();

  useEffect(() => {
    (async () => {
      await dbStoreService.createTable();
      await dbItemService.createTable();
      loadItems();
    })();
  }, []);

  const loadItems = async () => {
    const items = await dbItemService.readItem();
    setStoreItems(items);
  };

  const handleAddToCart = (item: Item) => {
    if (cart.find(i => i.id === item.id)) {
      Alert.alert('Aviso', 'Este item já está no carrinho!');
      return;
    }
    setCart(prev => [...prev, item]);
  };

  const handleRemoveFromCart = (index: number) => {
    const tmp = [...cart];
    tmp.splice(index, 1);
    setCart(tmp);
  };

  const handleCheckout = async (type: 'buy' | 'sell') => {
    const total = cart.reduce((sum, i) => sum + i.price, 0);

    if (type === 'buy') {
      // Tenta gastar as moedas; se não houver saldo, aborta
      if (!spendCoins(total)) {
        Alert.alert('Saldo insuficiente', 'Você não tem moedas suficientes para essa compra.');
        return;
      }
      await dbStoreService.createPurchase(cart);
    } else {
      // Vender: crédito de moedas
      await dbStoreService.createSale(cart.map(i => ({ itemId: i.id })));
      addCoins(total);
    }

    Alert.alert('Sucesso', type === 'buy' ? 'Compra realizada!' : 'Venda realizada!');
    setCart([]);
    setShowCartModal(false);
    loadItems();
  };

  const getCategoryStyle = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('arma')) {
      return { backgroundColor: '#FF465520', borderColor: '#FF4655' };
    } else if (lower.includes('armadura')) {
      return { backgroundColor: '#4CAF5020', borderColor: '#4CAF50' };
    } else if (lower.includes('acessório')) {
      return { backgroundColor: '#9C27B020', borderColor: '#9C27B0' };
    }
    return { backgroundColor: '#607D8B20', borderColor: '#607D8B' };
  };

  const renderStoreItem = ({ item }: { item: Item }) => (
    <View style={GlobalStyle.rewardCard}>
      <View style={[GlobalStyle.categoryTag, getCategoryStyle(item.category)]}>
        <Text style={{ color: getCategoryStyle(item.category).borderColor, fontSize: 12 }}>
          {item.category}
        </Text>
      </View>

      <Text style={styles.sectionItemName}>{item.name}</Text>
      <Text style={styles.sectionItemPrice}>Preço: {item.price} moedas</Text>

      <TouchableOpacity
        style={item.owned ? styles.sellButton : styles.buyButton}
        onPress={() => handleAddToCart(item)}
      >
        <Text style={styles.buttonText}>
          {item.owned ? 'Vender' : 'Comprar'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.titulo}>Loja do Caçador</Text>

      {/* Botão de Carrinho */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, { backgroundColor: '#4CAF5050' }]}
          onPress={() => setShowCartModal(true)}
        >
          <Text style={styles.tabText}>🛒 Carrinho ({cart.length})</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Itens para Compra</Text>
      <FlatList
        data={storeItems.filter(i => !i.owned)}
        keyExtractor={i => i.id}
        renderItem={renderStoreItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Text style={styles.sectionTitle}>Itens para Venda</Text>
      <FlatList
        data={storeItems.filter(i => i.owned)}
        keyExtractor={i => i.id}
        renderItem={renderStoreItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal do Carrinho */}
      <Modal visible={showCartModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {cart[0]?.owned ? 'Vender Itens' : 'Comprar Itens'}
          </Text>

          <FlatList
            data={cart}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.cartItem}>
                <Text style={styles.cartText}>{item.name}</Text>
                <Text style={styles.cartText}>{item.price} moedas</Text>
                <TouchableOpacity onPress={() => handleRemoveFromCart(index)}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Text style={styles.totalText}>
            Total: {cart.reduce((sum, i) => sum + i.price, 0)} moedas
          </Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCartModal(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => handleCheckout(cart[0]?.owned ? 'sell' : 'buy')}
            >
              <Text style={styles.buttonText}>
                {cart[0]?.owned ? 'Confirmar Venda' : 'Confirmar Compra'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
