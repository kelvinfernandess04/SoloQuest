import * as SQLite from 'expo-sqlite';

export async function getDbConnection() {
    const cx = await SQLite.openDatabaseAsync('dbSoloQuest.db');
    return cx;
}

export async function createTable() {    
        const query = `CREATE TABLE IF NOT EXISTS tbitems
        (
            id text not null primary key,
            name text not null,
            category text not null,
            price integer not null,
            owned boolean      
        )`;
    const cx = await getDbConnection();
    await cx.execAsync(query);   
    await cx.closeAsync();
};

export async function createItem(item: { 
    id: string;
    name: string;
    category: string;
    price: number;
    owned: boolean
}) {    
    const dbCx = await getDbConnection();    
    const query = 'INSERT INTO tbitems (id, name, category, price, owned) VALUES (?,?,?,?,?)';
    const result = await dbCx.runAsync(query, [item.id, item.name, item.category, item.price, item.owned ]);    
    await dbCx.closeAsync();    
    return result.changes === 1;    
}

export async function readItem() {
    interface ItemRow {
        id: string;
        name: string;
        category: string;
        price: number;
        owned: boolean
    }

    const dbCx = await getDbConnection();
    const registros = await dbCx.getAllAsync<ItemRow>('SELECT * FROM tbitems');
    await dbCx.closeAsync();

    return registros.map(registro => ({
        id: registro.id,
        name: registro.name,
        category: registro.category,
        price: registro.price,
        owned: registro.owned
    }));
}

export async function updateItem(item: { 
    id: string;
    name: string;
    category: string;
    price: number;
    owned: boolean
}) {
    const dbCx = await getDbConnection();
    const query = 'UPDATE tbitems SET name=?, category=?, price=?, owned=? WHERE id=?';
    const result = await dbCx.runAsync(query, [item.name, item.category, item.price, item.owned, item.id]);
    await dbCx.closeAsync();
    return result.changes === 1;
}

export async function deleteItem(id: string) {
    const dbCx = await getDbConnection();
    const query = 'DELETE FROM tbitems WHERE id=?';
    const result = await dbCx.runAsync(query, id);
    await dbCx.closeAsync();
    return result.changes === 1;    
}