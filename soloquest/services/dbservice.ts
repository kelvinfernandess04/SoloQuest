import * as SQLite from 'expo-sqlite';

export async function getDbConnection() {
    const cx = await SQLite.openDatabaseAsync('dbSoloQuest.db');
    return cx;
}

export async function createTable() {    
        const query = `CREATE TABLE IF NOT EXISTS tbquests
        (
            id text not null primary key,
            name text not null,
            description text not null,
            points integer not null        
        )`;
    const cx = await getDbConnection();
    await cx.execAsync(query);   
    await cx.closeAsync();
};

export async function createQuest(quest: { 
    id: string;
    name: string;
    description: string;
    points: number
}) {    
    const dbCx = await getDbConnection();    
    const query = 'INSERT INTO tbquests (id, name, description, points) VALUES (?,?,?,?)';
    const result = await dbCx.runAsync(query, [quest.id, quest.name, quest.description, quest.points]);    
    await dbCx.closeAsync();    
    return result.changes === 1;    
}

export async function readQuest() {
    interface QuestRow {
        id: string;
        name: string;
        description: string;
        points: number
    }

    const dbCx = await getDbConnection();
    const registros = await dbCx.getAllAsync<QuestRow>('SELECT * FROM tbQuests');
    await dbCx.closeAsync();

    return registros.map(registro => ({
        id: registro.id,
        name: registro.name,
        description: registro.description,
        points: registro.points
    }));
}

export async function updateQuest(quest: { 
    id: string;
    name: string;
    description: string;
    points: number
}) {
    const dbCx = await getDbConnection();
    const query = 'UPDATE tbquests SET name=?, description=?, points=? WHERE id=?';
    const result = await dbCx.runAsync(query, [quest.name, quest.description, quest.points, quest.id]);
    await dbCx.closeAsync();
    return result.changes === 1;
}

export async function deleteQuest(id: string) {
    const dbCx = await getDbConnection();
    const query = 'DELETE FROM tbquests WHERE id=?';
    const result = await dbCx.runAsync(query, id);
    await dbCx.closeAsync();
    return result.changes === 1;    
}