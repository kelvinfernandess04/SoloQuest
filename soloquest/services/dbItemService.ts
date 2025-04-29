// services/dbItemService.ts
import * as SQLite from 'expo-sqlite';

export type Quality = 'Comum' | 'Raro' | 'Épico' | 'Lendário';

export interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  owned: boolean;
  quality: Quality;
}

export async function getDbConnection() {
  return await SQLite.openDatabaseAsync('dbSoloQuest.db');
}

export async function createTable() {
  const db = await getDbConnection();
  const query = `
    CREATE TABLE IF NOT EXISTS tbitems (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      owned BOOLEAN,
      quality TEXT NOT NULL
    );
  `;
  await db.execAsync(query);
  await db.closeAsync();
}

export async function createItem(item: Item) {
  const db = await getDbConnection();
  const q = `INSERT INTO tbitems (id, name, category, price, owned, quality)
             VALUES (?,?,?,?,?,?);`;
  const res = await db.runAsync(q, [
    item.id,
    item.name,
    item.category,
    item.price,
    item.owned ? 1 : 0,
    item.quality
  ]);
  await db.closeAsync();
  return res.changes === 1;
}

export async function readItem(): Promise<Item[]> {
  const db = await getDbConnection();
  const rows = await db.getAllAsync<{
    id: string;
    name: string;
    category: string;
    price: number;
    owned: number;
    quality: Quality;
  }>('SELECT * FROM tbitems;');
  await db.closeAsync();
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    category: r.category,
    price: r.price,
    owned: !!r.owned,
    quality: r.quality
  }));
}

export async function updateItem(item: Item) {
  const db = await getDbConnection();
  const q = `UPDATE tbitems SET name=?, category=?, price=?, owned=?, quality=? WHERE id=?;`;
  const res = await db.runAsync(q, [
    item.name,
    item.category,
    item.price,
    item.owned ? 1 : 0,
    item.quality,
    item.id
  ]);
  await db.closeAsync();
  return res.changes === 1;
}

export async function deleteItem(id: string) {
  const db = await getDbConnection();
  const res = await db.runAsync('DELETE FROM tbitems WHERE id=?;', [id]);
  await db.closeAsync();
  return res.changes === 1;
}
