import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, Alert, Dimensions } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import * as dbItemService from '../services/dbItemService';
import * as dbStoreService from '../services/dbStoreService';
import { CustomList } from '../components/CustomList';
import { Item } from './inventory';
import { PieChart } from 'react-native-chart-kit';

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
  const [showChartModal, setShowChartModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cria as tabelas antes de carregar qualquer dado
        await dbStoreService.createTable();
        await dbItemService.createTable();

        await loadItems();
        await loadTransactions();
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
      console.log('Sales retornadas:', sales); // Verifique quantos registros estão sendo retornados
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
      console.log(error);
    }
  };

  // Cálculo dos totais para cada tipo de transação
  const totalBuy = transactions
    .filter((t) => t.type === 'buy')
    .reduce((acc, t) => acc + t.total, 0);
  const totalSell = transactions
    .filter((t) => t.type === 'sell')
    .reduce((acc, t) => acc + t.total, 0);

  const pieData = [
    {
      name: 'Compra',
      total: totalBuy,
      color: '#7C83FD',
      legendFontColor: '#7C83FD',
      legendFontSize: 12,
    },
    {
      name: 'Venda',
      total: totalSell,
      color: '#FF4655',
      legendFontColor: '#FF4655',
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
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

      {/* Botão para abrir o modal do Gráfico */}
      <TouchableOpacity
        style={[styles.tabButton, { backgroundColor: '#7C83FD', marginBottom: 12 }]}
        onPress={() => setShowChartModal(true)}>
        <Text style={styles.tabText}>📊 Gráfico de Vendas</Text>
      </TouchableOpacity>

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

      {/* Modal do Gráfico */}
      <Modal visible={showChartModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Gráfico de Vendas</Text>
          <PieChart
            data={pieData}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="total"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowChartModal(false)}>
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal do Carrinho */}
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

      {/* Modal do Histórico */}
      <Modal visible={showHistoryModal} animationType="slide">
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Histórico de Transações</Text>

          <FlatList
            data={transactions}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={({ item }) => (
              <View style={styles.transactionItem}>
                <View style={styles.transactionHeader}>
                  <Text style={styles.transactionDate}>
                    {new Date(item.saleDate).toLocaleDateString()}
                  </Text>
                  <Text style={styles.transactionTotal}>
                    {item.type === 'buy' ? 'Compra' : 'Venda'} - {item.total} moedas
                  </Text>
                </View>
                <Text style={styles.transactionItems}>
                  Itens: {item.items.map(i => i.name).join(', ')}
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
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
    justifyContent: 'center'
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
  // Estilização do Histórico
  historyContainer: {
    flex: 1,
    backgroundColor: '#0A0F24',
    padding: 20,
  },
  historyTitle: {
    color: '#E0E5FF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  transactionItem: {
    backgroundColor: '#161B33',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionDate: {
    color: '#E0E5FF',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionTotal: {
    color: '#7C83FD',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionItems: {
    color: '#A3A3A3',
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: '#7C83FD',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
});

// Função auxiliar para definir estilos com base na categoria (agora é string)
function getCategoryStyle(category: string) {
  const lowerCat = category.toLowerCase();
  if (lowerCat.includes("arma")) {
    return { backgroundColor: '#FF465520', borderColor: '#FF4655' };
  } else if (lowerCat.includes("armadura")) {
    return { backgroundColor: '#4CAF5020', borderColor: '#4CAF50' };
  } else if (lowerCat.includes("acessório")) {
    return { backgroundColor: '#9C27B020', borderColor: '#9C27B0' };
  }
  return { backgroundColor: '#607D8B20', borderColor: '#607D8B' };
}
