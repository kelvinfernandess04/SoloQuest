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
            description text not null          
        )`;
    var cx = await getDbConnection();
    await cx.execAsync(query);   
    await cx.closeAsync() ;
};

export async function createQuest(quest: { id: number; name: string; description: string}) {    
    let dbCx = await getDbConnection();    
    let query = 'insert into tbquests (id, name, description) values (?,?,?)';
    const result = await dbCx.runAsync(query, [quest.id, quest.name, quest.description]);    
    await dbCx.closeAsync() ;    
    return result.changes == 1;    
}
export async function readQuest() {

    var retorno = []
    var dbCx = await getDbConnection();
    const registros = await dbCx.getAllAsync('SELECT * FROM tbQuests');
    await dbCx.closeAsync() ;

    for (const registro of registros) {        
        let obj = {
            id: registro.id,
            nome: registro.nome,
            telefone: registro.telefone            
        }
        retorno.push(obj);
    }

    return retorno;
}
export async function upadteQuest(quest: any) {
    let dbCx = await getDbConnection();
    let query = 'update tbquests set name=?, description=? where id=?';
    const result = await dbCx.runAsync(query, [quest.name, quest.description, quest.id]);
    await dbCx.closeAsync() ;
    return result.changes == 1;
}

export async function deleteQuest(id: number) {
    let dbCx = await getDbConnection();
    let query = 'delete from tbquests where id=?';
    const result = await dbCx.runAsync(query, id);
    await dbCx.closeAsync() ;
    return result.changes == 1;    
}
