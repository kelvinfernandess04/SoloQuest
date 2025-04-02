import * as SQLite from 'expo-sqlite';

export async function getDbConnection() {
  const cx = await SQLite.openDatabaseAsync('dbSoloQuest.db');
  return cx;
}

export async function createTable() {
  const cx = await getDbConnection();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS tbitems (
        id TEXT NOT NULL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price INTEGER NOT NULL,
        owned BOOLEAN
      );
    `;
    await cx.execAsync(query);
  } finally {
    await cx.closeAsync();
  }
}

export async function createItem(item: { 
  id: string;
  name: string;
  category: string;
  price: number;
  owned: boolean;
}) {    
  const dbCx = await getDbConnection();    
  const query = 'INSERT INTO tbitems (id, name, category, price, owned) VALUES (?,?,?,?,?)';
  const result = await dbCx.runAsync(query, [item.id, item.name, item.category, item.price, item.owned]);
  await dbCx.closeAsync();    
  return result.changes === 1;    
}

export async function readItem() {
  interface ItemRow {
    id: string;
    name: string;
    category: string;
    price: number;
    owned: boolean;
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
  owned: boolean;
}, connection?: SQLite.SQLiteDatabase) {
  const dbCx = connection || await getDbConnection();
  const query = 'UPDATE tbitems SET name=?, category=?, price=?, owned=? WHERE id=?';
  const result = await dbCx.runAsync(query, [item.name, item.category, item.price, item.owned, item.id]);
  
  if (!connection) {
    await dbCx.closeAsync();
  }
  return result.changes === 1;
}

export async function deleteItem(id: string) {
  const dbCx = await getDbConnection();
  const query = 'DELETE FROM tbitems WHERE id=?';
  const result = await dbCx.runAsync(query, id);
  await dbCx.closeAsync();
  return result.changes === 1;    
}
