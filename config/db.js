/*import mysql from "mysql2";
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
    subject_name VARCHAR(255) NOT NULL,
    topic_name VARCHAR(255),
    your_doubt TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,

        `CREATE TABLE IF NOT EXISTS activity (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class VARCHAR(50),
    department VARCHAR(255),
    activity_name VARCHAR(255),
    activity_date DATE,
    remark TEXT,
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
    class VARCHAR(50),
    department VARCHAR(255),
    activity_name VARCHAR(255),
    activity_date DATE,
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,

        `CREATE TABLE IF NOT EXISTS classnotice (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class VARCHAR(50),
    section VARCHAR(10),
    event_name VARCHAR(255),
    description TEXT,
    remark TEXT,
    date_posted DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,



        `CREATE TABLE IF NOT EXISTS holiday_calendar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(255),
    holiday_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,


        `CREATE TABLE IF NOT EXISTS homework_list (
             id INT PRIMARY KEY AUTO_INCREMENT,
             subject_name VARCHAR(100) NOT NULL,
             topic_name VARCHAR(255) NOT NULL,
             description TEXT,
             due_date DATE,
             class VARCHAR(50),
             section VARCHAR(10),
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

        `CREATE TABLE IF NOT EXISTS homework_upload (
            id INT PRIMARY KEY AUTO_INCREMENT,
            subject_name VARCHAR(100),
            topic_name VARCHAR(255),
            task_description TEXT,
            submission_dateline DATE,
            file_url VARCHAR(255),
            class VARCHAR(50),
            section VARCHAR(10),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         )`,



        `CREATE TABLE IF NOT EXISTS hpc_syllabus (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session VARCHAR(100),
    class VARCHAR(50),
    section VARCHAR(20),
    syllabus_title VARCHAR(255),
    description TEXT,
    syllabus_pdf VARCHAR(255),
    uploaded_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,

        `CREATE TABLE IF NOT EXISTS notice_board (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    department VARCHAR(255),
    topic VARCHAR(255),
    description TEXT,
    date_posted DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,


        `CREATE TABLE IF NOT EXISTS online_classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class VARCHAR(50),
    section VARCHAR(10),
    subject_name VARCHAR(255),
    topic_name VARCHAR(255),
    teacher_name VARCHAR(255),
    meeting_platform VARCHAR(255),
    online_link TEXT,
    class_date DATE,
    class_time TIME,
    duration_minutes INT,
    description TEXT,
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,

        `CREATE TABLE IF NOT EXISTS results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session VARCHAR(100),
    class VARCHAR(50),
    section VARCHAR(20),
    exam_type VARCHAR(255),
    student_name VARCHAR(255),
    roll_number VARCHAR(50),
    total_marks INT,
    obtained_marks INT,
    grade VARCHAR(20),
    remarks TEXT,
    result_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,

        `CREATE TABLE IF NOT EXISTS school_notice (
    id INT PRIMARY KEY AUTO_INCREMENT,
    heading VARCHAR(255),
    notice TEXT,
    notice_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,

        `CREATE TABLE IF NOT EXISTS student_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admission_no VARCHAR(100),
    student_name VARCHAR(255),
    class VARCHAR(50),
    section VARCHAR(20),
    roll_number VARCHAR(50),
    gender VARCHAR(20),
    date_of_birth DATE,
    blood_group VARCHAR(20),
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    parent_mobile VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    student_photo VARCHAR(255),
    aadhaar_number VARCHAR(50),
    admission_date DATE,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,

        `CREATE TABLE IF NOT EXISTS syllabus (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session VARCHAR(100),
    class VARCHAR(50),
    section VARCHAR(20),
    subject_name VARCHAR(255),
    chapter_name VARCHAR(255),
    topic_name VARCHAR(255),
    description TEXT,
    start_date DATE,
    end_date DATE,
    learning_outcome TEXT,
    reference_material TEXT,
    status VARCHAR(50) DEFAULT 'Planned',
    file_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,

        `CREATE TABLE IF NOT EXISTS tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject VARCHAR(255),
    topic VARCHAR(255),
    description TEXT,
    class VARCHAR(50),
    section VARCHAR(20),
    due_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )`,

        `CREATE TABLE IF NOT EXISTS timetable (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class VARCHAR(50),
    section VARCHAR(20),
    day_name VARCHAR(50),
    period_name VARCHAR(100),
    subject_name VARCHAR(255),
    subject_teacher VARCHAR(255),
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

export default db;*/

import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const masterDb = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MASTER_DATABASE
});

masterDb.connect((err) => {
    if (err) {
        console.error("Master DB Connection Failed:", err);
    } else {
        console.log("Master DB Connected");
    }
});

export default masterDb;