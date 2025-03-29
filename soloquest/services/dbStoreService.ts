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
            category TEXT NOT NULL,
            price INTEGER NOT NULL,
            owned BOOLEAN      
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

export async function createSale(items: SaleItem[]) {
    const dbCx = await getDbConnection();
    
    try {
        await dbCx.execAsync('BEGIN TRANSACTION');

        // Verifica disponibilidade e calcula total
        let total = 0;
        for (const item of items) {
            const results = await dbCx.getAllAsync<{ price: number, owned: boolean }>(
                'SELECT price, owned FROM tbitems WHERE id = ?',
                [item.itemId]
            );
            
            const itemInfo = results[0]; // Pega o primeiro resultado do array
            
            if (!itemInfo || !itemInfo.owned) {
                throw new Error(`Item ${item.itemId} não disponível para venda`);
            }
            
            total += itemInfo.price;
        }   

        // Insere a venda principal
        const saleDate = new Date().toISOString();
        const saleResult = await dbCx.runAsync(
            'INSERT INTO tbSales (saleDate, total) VALUES (?, ?)',
            [saleDate, total]
        );
        const saleId = saleResult.lastInsertRowId;

        // Insere itens da venda e atualiza estoque
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
        await dbCx.closeAsync();
    }
}

export async function getSales() {
    const dbCx = await getDbConnection();
    const sales = await dbCx.getAllAsync<{
        id: number;
        saleDate: string;
        total: number;
    }>('SELECT * FROM tbSales ORDER BY saleDate DESC');
    await dbCx.closeAsync();
    return sales;
}

export async function getSaleDetails(saleId: number) {
    const dbCx = await getDbConnection();
    
    const sale = await dbCx.getAllSync<{
        id: number;
        saleDate: string;
        total: number;
    }>('SELECT * FROM tbSales WHERE id = ?', [saleId]);

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

    await dbCx.closeAsync();
    
    return {
        ...sale,
        items
    };
}
