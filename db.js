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

        createTables();
    }
});

const createTables = () => {

    const tables = [

        `CREATE TABLE IF NOT EXISTS academic_doubt (
            id INT PRIMARY KEY AUTO_INCREMENT,
            subject VARCHAR(255),
            topic VARCHAR(255),
            doubt TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS activity (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS assignments (
            id INT PRIMARY KEY AUTO_INCREMENT,
            subject VARCHAR(255),
            topic VARCHAR(255),
            description TEXT,
            due_date DATETIME,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS class_activity (
            id INT PRIMARY KEY AUTO_INCREMENT,
            activity_name VARCHAR(255),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS classnotice (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255),
            notice TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS complain_to_principal (
            id INT PRIMARY KEY AUTO_INCREMENT,
            student_name VARCHAR(255),
            complaint TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS holiday_calendar (
            id INT PRIMARY KEY AUTO_INCREMENT,
            holiday_name VARCHAR(255),
            holiday_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS homework_list (
            id INT PRIMARY KEY AUTO_INCREMENT,
            subject VARCHAR(255),
            homework TEXT,
            due_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS homework_upload (
            id INT PRIMARY KEY AUTO_INCREMENT,
            student_name VARCHAR(255),
            file_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS hpc_syllabus (
            id INT PRIMARY KEY AUTO_INCREMENT,
            subject VARCHAR(255),
            syllabus TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS notice_board (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255),
            notice TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS online_classes (
            id INT PRIMARY KEY AUTO_INCREMENT,
            subject VARCHAR(255),
            meeting_link TEXT,
            class_time DATETIME,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS results (
            id INT PRIMARY KEY AUTO_INCREMENT,
            student_name VARCHAR(255),
            marks VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS school_notice (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255),
            notice TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS student_profiles (
            id INT PRIMARY KEY AUTO_INCREMENT,
            student_name VARCHAR(255),
            class VARCHAR(50),
            section VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS syllabus (
            id INT PRIMARY KEY AUTO_INCREMENT,
            subject VARCHAR(255),
            syllabus TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS tasks (
            id INT PRIMARY KEY AUTO_INCREMENT,
            subject VARCHAR(255),
            topic VARCHAR(255),
            description TEXT,
            class VARCHAR(50),
            section VARCHAR(50),
            due_date DATETIME,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS timetable (
            id INT PRIMARY KEY AUTO_INCREMENT,
            class VARCHAR(50),
            subject VARCHAR(255),
            period_time VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    tables.forEach((tableQuery, index) => {
        db.query(tableQuery, (err) => {
            if (err) {
                console.log(`Table ${index + 1} creation error:`, err);
            } else {
                console.log(`Table ${index + 1} ready`);
            }
        });
    });
};

export default db;