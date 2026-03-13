import {MongoClient} from "mongodb";

const url = "mongodb://127.0.0.1:27017";

const client = new MongoClient(url);

let db;

export async function connectDB(){

    await client.connect();

    db = client.db("complaints_db");

    console.log("MongoDB Connected");

    return db;
}