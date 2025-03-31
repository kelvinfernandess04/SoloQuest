import * as SQLite from 'expo-sqlite';

export async function getDbConnection() {
    const cx = await SQLite.openDatabaseAsync('dbSoloQuest.db');
    return cx;
}

import { Category } from './dbCategoryService';

export interface Item {
  id: string;
  name: string;
  category: Category;  // Agora usa a interface Category
  price: number;
  owned: boolean;
}

export async function createTable() {    
    const db = await getDbConnection();
    try {
      await db.execAsync(`CREATE TABLE IF NOT EXISTS tbitems (
        id TEXT NOT NULL PRIMARY KEY,
        name TEXT NOT NULL,
        category_id TEXT NOT NULL,
        price INTEGER NOT NULL,
        owned BOOLEAN,
        FOREIGN KEY (category_id) REFERENCES tbcategories(id)
      )`);
      
      console.log("Tabela tbitems carregada com sucesso");
    } finally {
      await db.closeAsync();
    }
  };
export async function createItem(item: Item) {    
  const dbCx = await getDbConnection();    
  const query = 'INSERT INTO tbitems (id, name, category_id, price, owned) VALUES (?,?,?,?,?)';
  const result = await dbCx.runAsync(query, [
    item.id, 
    item.name, 
    item.category.id,  // Armazena apenas o ID da categoria
    item.price, 
    item.owned
  ]);    
  await dbCx.closeAsync();    
  return result.changes === 1;    
}

export async function readItem(): Promise<Item[]> {
  const dbCx = await getDbConnection();
  const query = `
    SELECT tbitems.*, tbcategories.name as category_name, tbcategories.color as category_color 
    FROM tbitems 
    JOIN tbcategories ON tbitems.category_id = tbcategories.id
  `;
  const registros = await dbCx.getAllAsync<any>(query);
  await dbCx.closeAsync();

  return registros.map(registro => ({
    id: registro.id,
    name: registro.name,
    category: {
      id: registro.category_id,
      name: registro.category_name,
      color: registro.category_color
    },
    price: registro.price,
    owned: registro.owned
  }));
}

export async function updateItem(item: Item) {
  const dbCx = await getDbConnection();
  const query = 'UPDATE tbitems SET name=?, category_id=?, price=?, owned=? WHERE id=?';
  const result = await dbCx.runAsync(query, [
    item.name,
    item.category.id,
    item.price,
    item.owned,
    item.id
  ]);
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