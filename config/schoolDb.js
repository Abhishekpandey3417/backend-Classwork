import mysql from "mysql2";
import dotenv from "dotenv";


dotenv.config();


export const getSchoolDB = (databaseName) => {
    console.log("DATABASE RECEIVED:", databaseName);

    if (!databaseName) {
        throw new Error("Database name is missing");
    }

    return mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: databaseName
    });
};

export default getSchoolDB;