import * as SQLite from 'expo-sqlite';

export interface Category {
    id: string;
    name: string;
    color: string;
  }

export async function getDbConnection() {
    const cx = await SQLite.openDatabaseAsync('dbSoloQuest.db');
    return cx;
}

// Cria tabela de categorias
export async function createCategoriesTable() {    
  const query = `CREATE TABLE IF NOT EXISTS tbcategories (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL
  )`;
  const cx = await getDbConnection();
  await cx.execAsync(query);   
  await cx.closeAsync();
};

// Adiciona nova categoria
export async function createCategory(category: Category) {    
  const dbCx = await getDbConnection();    
  const query = 'INSERT INTO tbcategories (id, name, color) VALUES (?,?,?)';
  const result = await dbCx.runAsync(query, [
    category.id, 
    category.name, 
    category.color
  ]);    
  await dbCx.closeAsync();    
  return result.changes === 1;    
}

// Obtém todas as categorias
export async function readCategories(): Promise<Category[]> {
  const dbCx = await getDbConnection();
  const registros = await dbCx.getAllAsync<Category>('SELECT * FROM tbcategories');
  await dbCx.closeAsync();
  return registros;
}

// Remove categoria
export async function deleteCategory(id: string) {
  const dbCx = await getDbConnection();
  const query = 'DELETE FROM tbcategories WHERE id=?';
  const result = await dbCx.runAsync(query, id);
  await dbCx.closeAsync();
  return result.changes === 1;    
}