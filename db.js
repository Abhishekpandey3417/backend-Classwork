import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

console.log("DB USER:", process.env.MYSQL_USER);
console.log("DB HOST:", process.env.MYSQL_HOST);
console.log("DB NAME:", process.env.MYSQL_DATABASE);

db.connect((err) => {
    if (err) {
        console.error("DB Connection Failed:", err);
    } else {
        console.log("MySQL Connected Successfully");
    }
});

export default db;