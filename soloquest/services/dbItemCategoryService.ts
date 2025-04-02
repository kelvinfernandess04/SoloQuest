import * as SQLite from 'expo-sqlite';

export async function getDbConnection() {
  const cx = await SQLite.openDatabaseAsync('dbSoloQuest.db');
  return cx;
}

export async function createTable() {
  const cx = await getDbConnection();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS tbItemCategories (
        id TEXT NOT NULL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );
    `;
    await cx.execAsync(query);
  } finally {
    try {
      await cx.closeAsync();
    } catch (error) {
      console.warn("Erro ao fechar conexão (dbItemCategoryService.createTable):", error);
    }
  }
}

export async function createCategory(category: { id: string; name: string }) {
  const cx = await getDbConnection();
  try {
    const query = 'INSERT INTO tbItemCategories (id, name) VALUES (?, ?)';
    const result = await cx.runAsync(query, [category.id, category.name]);
    return result.changes === 1;
  } finally {
    try {
      await cx.closeAsync();
    } catch (error) {
      console.warn("Erro ao fechar conexão (dbItemCategoryService.createCategory):", error);
    }
  }
}

export async function readCategories() {
  const cx = await getDbConnection();
  try {
    const rows = await cx.getAllAsync<{ id: string; name: string }>('SELECT * FROM tbItemCategories');
    return rows;
  } finally {
    try {
      await cx.closeAsync();
    } catch (error) {
      console.warn("Erro ao fechar conexão (dbItemCategoryService.readCategories):", error);
    }
  }
}

export async function updateCategory(category: { id: string; name: string }) {
  const cx = await getDbConnection();
  try {
    const query = 'UPDATE tbItemCategories SET name=? WHERE id=?';
    const result = await cx.runAsync(query, [category.name, category.id]);
    return result.changes === 1;
  } finally {
    try {
      await cx.closeAsync();
    } catch (error) {
      console.warn("Erro ao fechar conexão (dbItemCategoryService.updateCategory):", error);
    }
  }
}

export async function deleteCategory(id: string) {
  const cx = await getDbConnection();
  try {
    const query = 'DELETE FROM tbItemCategories WHERE id=?';
    const result = await cx.runAsync(query, [id]);
    return result.changes === 1;
  } finally {
    try {
      await cx.closeAsync();
    } catch (error) {
      console.warn("Erro ao fechar conexão (dbItemCategoryService.deleteCategory):", error);
    }
  }
}
