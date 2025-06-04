const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

async function main() {
    const client = new MongoClient(process.env.ATLAS_URI);
    
    try {
        await client.connect();
        const database = client.db("solo_quest");
        const collections = await database.listCollections().toArray();
        
        console.log("Collections:");
        for (const collection of collections) {
            console.log(`- ${collection.name}`);
        }
        
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await client.close();
    }
}

main().catch(console.error);