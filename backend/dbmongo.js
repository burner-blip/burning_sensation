import { MongoClient } from "mongodb";

const url = "mongodb://127.0.0.1:27017";
const dbName = "mydb";

const client = new MongoClient(url);

let db;

export async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db(dbName);
        console.log("MongoDB connected");
    }
    return db;
}