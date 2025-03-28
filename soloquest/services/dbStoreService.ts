import * as SQLite from 'expo-sqlite';

export async function getDbConnection() {
    const cx = await SQLite.openDatabaseAsync('dbSoloQuest.db');
    return cx;
}

export async function createTable() {
    let query = `CREATE TABLE IF NOT EXISTS tbsale
        (
            id text not null primary key,
            price integer not null        
        )`;
    const cx = await getDbConnection();
    await cx.execAsync(query);

    query = `CREATE TABLE IF NOT EXISTS tbsaleanditens
        (
            id text not null primary key,
            price integer not null        
        )`;
    await cx.execAsync(query);
    await cx.closeAsync();
};