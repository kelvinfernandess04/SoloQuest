import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, Alert } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import * as dbItemService from '../services/dbItemService';
import * as dbStoreService from '../services/dbStoreService';
import { CustomList } from '../components/CustomList';
import { Item, ItemCategory } from './inventory';


interface Transaction {
  id: number;
  saleDate: string;
  total: number;
  type: 'buy' | 'sell';
  items: { name: string; price: number }[];
}

export default function Store() {
  const [storeItems, setStoreItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<Item[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadItems();
        await loadTransactions();
        dbStoreService.createTable();
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);


  const loadItems = async () => {
    const items = await dbItemService.readItem() as Item[];
    setStoreItems(items);
  };

  const loadTransactions = async () => {
    try {

      const sales = await dbStoreService.getSales();
      const transactionsWithDetails = await Promise.all(
        sales.map(async (sale) => {
          const details = await dbStoreService.getSaleDetails(sale.id);
          return {
            ...sale,
            items: details.items
          };
        })
      );
      setTransactions(transactionsWithDetails);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar histórico');
    }
  };

  const handleAddToCart = (item: Item) => {
    const isItemInCart = cart.some(cartItem => cartItem.id === item.id);

    if (isItemInCart) {
      Alert.alert('Aviso', 'Este item já está no carrinho!');
      return;
    }
    setCart([...cart, item]);
  };

  const handleRemoveFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleCheckout = async (type: 'buy' | 'sell') => {
    try {



      if (type === 'buy') {
        await dbStoreService.createPurchase(cart);
      } else {
        await dbStoreService.createSale(cart.map(item => ({ itemId: item.id })));
      }

      Alert.alert('Sucesso', type === 'buy' ? 'Compra realizada!' : 'Venda realizada!');
      setCart([]);
      setShowCartModal(false);
      await loadItems();
      await loadTransactions();
    } catch (error) {
      console.error('Erro ao realizar transação:', error);
      Alert.alert('Erro, verifique o console');
    }
  };

  const renderStoreItem = ({ item }: { item: Item }) => (
    <View style={GlobalStyle.rewardCard}>
      <View style={[GlobalStyle.categoryTag, getCategoryStyle(item.category)]}>
        <Text style={{ color: getCategoryStyle(item.category).borderColor, fontSize: 12 }}>
          {item.category}
        </Text>
      </View>

      <Text style={{ color: '#E0E5FF', fontSize: 18, marginBottom: 8 }}>
        {item.name}
      </Text>

      <Text style={{ color: '#7C83FD', marginBottom: 8 }}>
        Preço: {item.price} moedas
      </Text>

      {!item.owned ? (
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => handleAddToCart(item)}>
          <Text style={styles.buttonText}>Comprar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.sellButton}
          onPress={() => handleAddToCart(item)}>
          <Text style={styles.buttonText}>Vender</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.titulo}>Loja do Caçador</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, { backgroundColor: '#4CAF5050' }]}
          onPress={() => setShowCartModal(true)}>
          <Text style={styles.tabText}>🛒 Carrinho ({cart.length})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, { backgroundColor: '#9C27B050' }]}
          onPress={() => setShowHistoryModal(true)}>
          <Text style={styles.tabText}>📜 Histórico</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Itens Disponíveis para Compra</Text>
      <CustomList
        data={storeItems.filter(item => !item.owned)}
        keyExtractor={(item) => item.id}
        renderItem={renderStoreItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Text style={styles.sectionTitle}>Itens Disponíveis para Venda</Text>
      <CustomList
        data={storeItems.filter(item => item.owned)}
        keyExtractor={(item) => item.id}
        renderItem={renderStoreItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal visible={showCartModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {cart[0]?.owned ? 'Vender Itens' : 'Comprar Itens'}
          </Text>

          <FlatList
            data={cart}
            keyExtractor={(_, index) => index.toString()}
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
            Total: {cart.reduce((sum, item) => sum + item.price, 0)} moedas
          </Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCartModal(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => handleCheckout(cart[0]?.owned ? 'sell' : 'buy')}>
              <Text style={styles.buttonText}>
                {cart[0]?.owned ? 'Confirmar Venda' : 'Confirmar Compra'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showHistoryModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Histórico de Transações</Text>

          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.transactionItem}>
                <Text style={styles.transactionText}>
                  {new Date(item.saleDate).toLocaleDateString()}
                </Text>
                <Text style={styles.transactionText}>
                  {item.type === 'buy' ? 'Compra' : 'Venda'} - {item.total} moedas
                </Text>
                <Text style={styles.transactionText}>
                  Itens: {item.items.map(i => i.name).join(', ')}
                </Text>
              </View>
            )}
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowHistoryModal(false)}>
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

// Estilos (adicione ao seu GlobalStyles ou crie um StoreStyles)
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButton: {
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  tabText: {
    color: '#E0E5FF',
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#7C83FD',
    fontSize: 20,
    marginVertical: 10,
    fontFamily: 'Cinzel-Bold',
  },
  buyButton: {
    backgroundColor: '#4CAF5050',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  sellButton: {
    backgroundColor: '#9C27B050',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9C27B0',
  },
  buttonText: {
    color: '#E0E5FF',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0A0F24',
    padding: 20,
  },
  modalTitle: {
    color: '#E0E5FF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F4D',
  },
  cartText: {
    color: '#E0E5FF',
    fontSize: 16,
  },
  removeText: {
    color: '#FF4655',
    fontSize: 20,
  },
  totalText: {
    color: '#7C83FD',
    fontSize: 20,
    textAlign: 'right',
    margin: 15,
    fontFamily: 'Orbitron-SemiBold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#FF465550',
    padding: 15,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF4655',
  },
  checkoutButton: {
    backgroundColor: '#7C83FD',
    padding: 15,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
  },
  transactionItem: {
    backgroundColor: '#161B33',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionText: {
    color: '#E0E5FF',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#7C83FD',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
});

// Adicione esta função auxiliar no mesmo arquivo ou em GlobalStyles
function getCategoryStyle(category: ItemCategory) {
  switch (category) {
    case ItemCategory.Weapon:
      return { backgroundColor: '#FF465520', borderColor: '#FF4655' };
    case ItemCategory.Armor:
      return { backgroundColor: '#4CAF5020', borderColor: '#4CAF50' };
    case ItemCategory.Acessorie:
      return { backgroundColor: '#9C27B020', borderColor: '#9C27B0' };
    default:
      return { backgroundColor: '#607D8B20', borderColor: '#607D8B' };
  }
}