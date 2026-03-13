import mysql from "mysql2/promise";

let db;

export async function connectSqlDB(){

    db = await mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"12345678",
        port:4802
    });

    await db.query("CREATE DATABASE IF NOT EXISTS complaints_db");

    await db.query("USE complaints_db");

    await db.query(`
        CREATE TABLE IF NOT EXISTS users(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100),
            phone VARCHAR(20),
            password VARCHAR(100)
        )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS complaints(
            complaint_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            title VARCHAR(100),
            category VARCHAR(100),
            priority VARCHAR(50),
            status VARCHAR(50)
        )
    `);

    console.log("MySQL Connected");
}

export function getSqlDB(){
    return db;
}