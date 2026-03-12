import express from 'express';
import { connectDB } from "./dbmongo.js";
import pool from "./dbsql.js";


const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');   
}); 

app.listen(3000, () => {
    pool.getConnection().then(connection => {
        console.log("MySQL connected");
        connection.release();
    }).catch(err => {
        console.error("MySQL connection error:", err);
    });
    console.log('app listening on port 3000!');
});