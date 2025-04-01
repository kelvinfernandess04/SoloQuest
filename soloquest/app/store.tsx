import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, Alert } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import * as dbItemService from '../services/dbItemService';
import * as dbStoreService from '../services/dbStoreService';
import { CustomList } from '../components/CustomList';
import { Item } from '../services/dbItemService';
import { Category } from '../services/dbCategoryService';

interface FullItem extends Item {
  category: Category;
}

interface Transaction {
  id: number;
  saleDate: string;
  total: number;
  type: 'buy' | 'sell';
  items: { name: string; price: number }[];
}

export default function Store() {
  const [storeItems, setStoreItems] = useState<FullItem[]>([]);
  const [cart, setCart] = useState<FullItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  

  // Carregar itens e histórico
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await dbStoreService.createTable();
        await loadItems();
        await loadTransactions();
      } catch (error) {
        console.error("Erro ao inicializar banco de dados:", error);
        Alert.alert("Erro", "Não foi possível inicializar o banco de dados");
      }
    };
  
    initializeDatabase();
  }, []);

  const loadItems = async () => {
    const items = await dbItemService.readItem(); 
    setStoreItems(items);
  };
  const loadTransactions = async () => {
    try {
      const sales = await dbStoreService.getSales();
      const transactionsWithType: Transaction[] = sales.map(sale => ({
        ...sale,
        type: 'sell',
        items: []
      }));
      setTransactions(transactionsWithType);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico de transações');
    }
  };

  // Adicionar ao carrinho
  const handleAddToCart = (item: Item) => {
    setCart([...cart, item]);
  };

  // Remover do carrinho
  const handleRemoveFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // Finalizar compra/venda
  const handleCheckout = async (type: 'buy' | 'sell') => {
    try {
      if (type === 'buy') {
        // Lógica de compra
        await Promise.all(cart.map(item => 
          dbItemService.updateItem({ ...item, owned: true })
        ));
      } else {
        // Lógica de venda
        await dbStoreService.createSale(cart.map(item => ({ itemId: item.id })));
      }

      Alert.alert('Sucesso', type === 'buy' ? 'Compra realizada!' : 'Venda realizada!');
      setCart([]);
      setShowCartModal(false);
      loadItems();
      loadTransactions();
    } catch (error) {
      Alert.alert('Erro. Não é possível vender e comprar ao mesmo tempo');
    }
  };

  // Renderizar item da loja
  const renderStoreItem = ({ item }: { item: Item }) => (
    <View style={GlobalStyle.rewardCard}>
      <View style={[GlobalStyle.categoryTag, getCategoryStyle(item.category)]}>
      <Text style={{ color: getCategoryStyle(item.category).borderColor, fontSize: 12 }}>
  {item.category.name} {/* Era apenas item.category */}
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

      {/* Abas de Compra/Venda */}
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

      {/* Lista de Itens para Compra */}
      <Text style={styles.sectionTitle}>Itens Disponíveis para Compra</Text>
      <CustomList
        data={storeItems.filter(item => !item.owned)}
        keyExtractor={(item) => item.id}
        renderItem={renderStoreItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Lista de Itens para Venda */}
      <Text style={styles.sectionTitle}>Itens Disponíveis para Venda</Text>
      <CustomList
        data={storeItems.filter(item => item.owned)}
        keyExtractor={(item) => item.id}
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
            keyExtractor={(item, index) => index.toString()}
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

      {/* Modal do Histórico */}
      <Modal visible={showHistoryModal} animationType="slide">
  <View style={styles.modalContainer}>
    <Text style={styles.modalTitle}>Histórico de Transações</Text>

    {transactions.length === 0 ? (
      <Text style={{ color: '#E0E5FF', textAlign: 'center', marginTop: 20 }}>
        Nenhuma transação encontrada
      </Text>
    ) : (
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionText}>
              Data: {new Date(item.saleDate).toLocaleDateString()}
            </Text>
            <Text style={styles.transactionText}>
              Tipo: {item.type === 'buy' ? 'Compra' : 'Venda'}
            </Text>
            <Text style={styles.transactionText}>
              Total: {item.total} moedas
            </Text>
          </View>
        )}
      />
    )}

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

// Estilos
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

function getCategoryStyle(category: Category) {
  return { 
    backgroundColor: `${category.color}20`, 
    borderColor: category.color 
  };
}