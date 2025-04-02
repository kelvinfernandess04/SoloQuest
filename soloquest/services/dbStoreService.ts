import * as SQLite from 'expo-sqlite';

export async function getDbConnection() {
  const cx = await SQLite.openDatabaseAsync('dbSoloQuest.db');
  return cx;
}

export async function createTable() {
  const cx = await getDbConnection();
  try {
    // Habilita chaves estrangeiras
    await cx.execAsync('PRAGMA foreign_keys = ON;');

    // Criação da tabela de itens
    await cx.execAsync(`
      CREATE TABLE IF NOT EXISTS tbitems (
          id TEXT NOT NULL PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          price INTEGER NOT NULL,
          owned BOOLEAN
      );
    `);

    // Criação da tabela de vendas
    await cx.execAsync(`
      CREATE TABLE IF NOT EXISTS tbSales (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          saleDate TEXT NOT NULL,
          total INTEGER NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('buy', 'sell'))
      );
    `);

    // Criação da tabela de itens vendidos/comprados
    await cx.execAsync(`
      CREATE TABLE IF NOT EXISTS tbSaleItems (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          saleId INTEGER NOT NULL,
          itemId TEXT NOT NULL,
          FOREIGN KEY(saleId) REFERENCES tbSales(id) ON DELETE CASCADE,
          FOREIGN KEY(itemId) REFERENCES tbitems(id)
      );
    `);
  } finally {
    try {
      await cx.closeAsync();
    } catch (error) {
      console.warn("Erro ao fechar conexão (createTable):", error);
    }
  }
}

interface SaleItem {
  itemId: string;
}

export async function createSale(items: SaleItem[]) {
  const dbCx = await getDbConnection();
  
  try {
    await dbCx.execAsync('BEGIN TRANSACTION');

    let total = 0;
    for (const item of items) {
      const results = await dbCx.getAllAsync<{ price: number, owned: boolean }>(
        'SELECT price, owned FROM tbitems WHERE id = ?',
        [item.itemId]
      );
      
      const itemInfo = results[0];
      if (!itemInfo || !itemInfo.owned) {
        throw new Error(`Item ${item.itemId} não disponível para venda`);
      }
      total += itemInfo.price;
    }   

    const saleDate = new Date().toISOString();
    const saleResult = await dbCx.runAsync(
      'INSERT INTO tbSales (saleDate, total, type) VALUES (?, ?, ?)',
      [saleDate, total, 'sell']
    );
    const saleId = saleResult.lastInsertRowId;

    for (const item of items) {
      await dbCx.runAsync(
        'INSERT INTO tbSaleItems (saleId, itemId) VALUES (?, ?)',
        [saleId, item.itemId]
      );
      
      await dbCx.runAsync(
        'UPDATE tbitems SET owned = 0 WHERE id = ?',
        [item.itemId]
      );
    }

    await dbCx.execAsync('COMMIT');
    return { success: true, saleId };
  } catch (error) {
    await dbCx.execAsync('ROLLBACK');
    throw error;
  } finally {
    try {
      await dbCx.closeAsync();
    } catch (error) {
      console.warn("Erro ao fechar conexão (createSale):", error);
    }
  }
}

export async function createPurchase(items: any[]) {
  const dbCx = await getDbConnection();
  
  try {
    await dbCx.execAsync('BEGIN TRANSACTION');

    const total = items.reduce((sum, item) => sum + item.price, 0);
    const saleDate = new Date().toISOString();

    const saleResult = await dbCx.runAsync(
      'INSERT INTO tbSales (saleDate, total, type) VALUES (?, ?, ?)',
      [saleDate, total, 'buy']
    );
    const saleId = saleResult.lastInsertRowId;

    for (const item of items) {
      await dbCx.runAsync(
        'INSERT INTO tbSaleItems (saleId, itemId) VALUES (?, ?)',
        [saleId, item.id]
      );
      
      await dbCx.runAsync(
        'UPDATE tbitems SET owned = 1 WHERE id = ?',
        [item.id]
      );
    }

    await dbCx.execAsync('COMMIT');
    return { success: true, saleId };
  } catch (error) {
    await dbCx.execAsync('ROLLBACK');
    throw error;
  } finally {
    try {
      await dbCx.closeAsync();
    } catch (error) {
      console.warn("Erro ao fechar conexão (createPurchase):", error);
    }
  }
}

export async function getSales() {
  const dbCx = await getDbConnection();
  try {
    const sales = await dbCx.getAllAsync<{
      id: number;
      saleDate: string;
      total: number;
      type: 'buy' | 'sell';
    }>('SELECT * FROM tbSales ORDER BY saleDate DESC');
    return sales;
  } finally {
    try {
      await dbCx.closeAsync();
    } catch (error) {
      console.warn("Erro ao fechar conexão (getSales):", error);
    }
  }
}

export async function getSaleDetails(saleId: number) {
  const dbCx = await getDbConnection();
  try {
    const items = await dbCx.getAllAsync<{
      id: string;
      name: string;
      price: number;
    }>(`
      SELECT i.id, i.name, i.price 
      FROM tbSaleItems si
      JOIN tbitems i ON si.itemId = i.id
      WHERE si.saleId = ?
    `, [saleId]);
    return { items };
  } finally {
    try {
      await dbCx.closeAsync();
    } catch (error) {
      console.warn("Erro ao fechar conexão (getSaleDetails):", error);
    }
  }
}
