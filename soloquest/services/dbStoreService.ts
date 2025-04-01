import * as SQLite from 'expo-sqlite';

export async function getDbConnection() {
    const cx = await SQLite.openDatabaseAsync('dbSoloQuest.db');
    return cx;
}

export async function createTable() {    
    const query = `
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS tbitems (
            id TEXT NOT NULL PRIMARY KEY,
            name TEXT NOT NULL,
            category_id TEXT NOT NULL,
            price INTEGER NOT NULL,
            owned BOOLEAN,
            FOREIGN KEY (category_id) REFERENCES tbcategories(id)      
        );

        CREATE TABLE IF NOT EXISTS tbSales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            saleDate TEXT NOT NULL,
            total INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS tbSaleItems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            saleId INTEGER NOT NULL,
            itemId TEXT NOT NULL,
            FOREIGN KEY(saleId) REFERENCES tbSales(id) ON DELETE CASCADE,
            FOREIGN KEY(itemId) REFERENCES tbitems(id)
        );
    `;
    const cx = await getDbConnection();
    await cx.execAsync(query);   
    await cx.closeAsync();
};
interface SaleItem {
    itemId: string;
}

//Psiu kelvim, adicionei uns logs pra ver a transação
export async function createSale(items: SaleItem[]) {
    const dbCx = await getDbConnection();
    
    try {
      console.log('Iniciando transação de venda...'); // LOG
      await dbCx.execAsync('BEGIN TRANSACTION');
  
      let total = 0;
      console.log('Itens para vender:', items); // LOG
      
      for (const item of items) {
        const results = await dbCx.getAllAsync<{ price: number, owned: boolean }>(
          'SELECT price, owned FROM tbitems WHERE id = ?',
          [item.itemId]
        );
        
        const itemInfo = results[0];
        console.log('Informações do item:', itemInfo); // LOG
        
        if (!itemInfo || !itemInfo.owned) {
          throw new Error(`Item ${item.itemId} não disponível para venda`);
        }
        
        total += itemInfo.price;
      }   
  
      console.log('Total da venda:', total); // LOG
      
      const saleDate = new Date().toISOString();
      const saleResult = await dbCx.runAsync(
        'INSERT INTO tbSales (saleDate, total) VALUES (?, ?)',
        [saleDate, total]
      );
      const saleId = saleResult.lastInsertRowId;
      console.log('Venda criada com ID:', saleId); // LOG
  
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
      console.log('Venda concluída com sucesso'); // LOG
      return { success: true, saleId };
    } catch (error) {
      console.error('Erro na venda:', error); // LOG
      await dbCx.execAsync('ROLLBACK');
      throw error;
    } finally {
      await dbCx.closeAsync();
    }
  }

  export async function getSales() {
    const db = await getDbConnection();
    try {
      const sales = await db.getAllAsync<{
        id: number;
        saleDate: string;
        total: number;
      }>('SELECT * FROM tbSales ORDER BY saleDate DESC');
      return sales;
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      throw error;
    } finally {
      try {
        await db.closeAsync();
      } catch (closeError) {
        console.error('Erro ao fechar conexão:', closeError);
      }
    }
  }

export async function getSaleDetails(saleId: number) {
    const dbCx = await getDbConnection();
    
    const sale = await dbCx.getFirstAsync<{
        id: number;
        saleDate: string;
        total: number;
    }>('SELECT * FROM tbSales WHERE id = ?', [saleId]);

    const items = await dbCx.getAllAsync<{
        id: string;
        name: string;
        price: number;
        category_id: string;
        category_name: string;
        category_color: string;
    }>(`
        SELECT 
            i.id, 
            i.name, 
            i.price,
            c.id as category_id,
            c.name as category_name,
            c.color as category_color
        FROM tbSaleItems si
        JOIN tbitems i ON si.itemId = i.id
        JOIN tbcategories c ON i.category_id = c.id
        WHERE si.saleId = ?
    `, [saleId]);

    await dbCx.closeAsync();
    
    return {
        ...sale,
        items: items.map(item => ({
            ...item,
            category: {
                id: item.category_id,
                name: item.category_name,
                color: item.category_color
            }
        }))
    };
}
