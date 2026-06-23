import { getSchoolDB } from "../config/schoolDb.js";

const getDB = (req) => getSchoolDB(req.databaseName);



/* ================= CREATE HOMEWORK ================= */
export const createHomework = async (req, res) => {
    try {
     console.log("CREATE DATABASE =", req.databaseName);

const db = getSchoolDB(req.databaseName);

const [dbName] = await db.promise().query("SELECT DATABASE() AS db");
console.log("MYSQL DATABASE =", dbName);

        const {
            subject_name,
            topic_name,
            description,
            due_date,
            class: className,
            section
        } = req.body;

        const [result] = await db.promise().query(
            `INSERT INTO homework_list
            (subject_name, topic_name, description, due_date, class, section)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [subject_name, topic_name, description, due_date, className, section]
        );

        db.end();

        return res.status(201).json({
            success: true,
            message: "Homework created successfully",
            id: result.insertId
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/* ================= GET HOMEWORK ================= */
export const getHomework = (req, res) => {
    console.log("GET DATABASE =", req.databaseName);

const db = getSchoolDB(req.databaseName);

db.query("SELECT DATABASE() AS db", (err, rows) => {
    console.log("MYSQL DATABASE =", rows);
});

    const { id } = req.params;

    let sql = "SELECT * FROM homework_list";
    let values = [];

    if (id) {
        sql += " WHERE id = ?";
        values.push(id);
    }

    db.query(sql, values, (err, result) => {

        db.end();

        if (err) return res.status(500).json(err);

        if (id && result.length === 0) {
            return res.status(404).json({
                message: "Homework not found"
            });
        }

        if (id) {
            return res.json(result[0]);
        }

        res.json(result);
    });
};


export const updateHomework = (req, res) => {
    const db = getDB(req);
    const { id } = req.params;

    const allowedFields = [
        "subject_name",
        "topic_name",
        "description",
        "due_date",
        "class",
        "section"
    ];

    // 🚫 Reject unwanted fields
    const invalidFields = Object.keys(req.body).filter(
        key => !allowedFields.includes(key)
    );

    if (invalidFields.length > 0) {
        return res.status(400).json({
            message: `Invalid fields: ${invalidFields.join(", ")}`
        });
    }

    const {
        subject_name,
        topic_name,
        description,
        due_date,
        class: className,
        section
    } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Homework ID is required" });
    }

    const parsedDate = new Date(due_date);
    if (!due_date || isNaN(parsedDate)) {
        return res.status(400).json({ message: "Valid due_date required" });
    }

    const formattedDate = parsedDate.toISOString().slice(0, 10);

    const sql = `
        UPDATE homework_list
        SET subject_name = ?, topic_name = ?, description = ?, due_date = ?, class = ?, section = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [subject_name, topic_name, description, formattedDate, className, section, id],
        (err, result) => {
            if (err) return res.status(500).json(err);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Homework not found" });
            }

            res.json({ message: "Homework updated successfully" });
        }
    );
};

/* ================= DELETE HOMEWORK ================= */
export const deleteHomework = (req, res) => {
    const db = getDB(req);

    const { id } = req.params;

    db.query(
        "DELETE FROM homework_list WHERE id = ?",
        [id],
        (err) => {

            db.end();

            if (err) return res.status(500).json(err);

            res.json({
                message: "Homework deleted"
            });
        }
    );
};

/* ================= UPLOAD HOMEWORK ================= */
export const uploadHomework = (req, res) => {

    const db = getDB(req);
    const {
        subject_name,
        topic_name,
        task_description,
        submission_dateline,
        class: className,
        section
    } = req.body;

    // Validate date
    const parsedDate = new Date(submission_dateline);
    if (!submission_dateline || isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Valid submission_dateline required" });
    }

    const formattedDate = parsedDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

    // File handling (changed here)
    const file = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO homework_upload 
        (subject_name, topic_name, task_description, submission_dateline, file, class, section)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        subject_name,
        topic_name,
        task_description,
        formattedDate,
        file,
        className,
        section
    ];

    db.query(sql, values, (err, result) => {

    db.end();

    if (err) {
        return res.status(500).json({
            message: "Database error",
            error: err.sqlMessage
        });
    }

    res.status(201).json({
        message: "Homework submitted successfully",
        id: result.insertId,
        file
    });
});
};

/* ================= GET UPLOADS ================= */
export const getUploadsHomeworks = (req, res) => {
    const db = getDB(req);
    const { homework_id, class: className, section } = req.query;

    let sql = "SELECT * FROM homework_upload WHERE 1=1";
    let values = [];

    if (homework_id) {
        sql += " AND homework_id = ?";
        values.push(homework_id);
    }

    if (className) {
        sql += " AND class = ?";
        values.push(className);
    }

    if (section) {
        sql += " AND section = ?";
        values.push(section);
    }

   db.query(sql, values, (err, result) => {

    db.end();

    if (err) return res.status(500).json(err);

    res.json(result);
});
};

/* ================= UPDATE UPLOAD ================= */
export const updateUploadHomework = (req, res) => {
    const db = getDB(req);
    const { id } = req.params;
    const {
        homework_id,
        subject_name,
        topic_name,
        task_description,
        submission_dateline,
        class: className,
        section
    } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Upload ID is required" });
    }

    let formattedDate = null;
    if (submission_dateline) {
        const parsedDate = new Date(submission_dateline);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: "Valid submission_dateline required" });
        }
        formattedDate = parsedDate.toISOString().slice(0, 19).replace("T", " ");
    }

    const file = req.file ? req.file.filename : null;

    let sql = "UPDATE homework_upload SET ";
    let values = [];

    if (homework_id) {
        sql += "homework_id = ?, ";
        values.push(homework_id);
    }

    if (subject_name) {
        sql += "subject_name = ?, ";
        values.push(subject_name);
    }

    if (topic_name) {
        sql += "topic_name = ?, ";
        values.push(topic_name);
    }

    if (task_description) {
        sql += "task_description = ?, ";
        values.push(task_description);
    }

    if (formattedDate) {
        sql += "submission_dateline = ?, ";
        values.push(formattedDate);
    }

    if (className) {
        sql += "class = ?, ";
        values.push(className);
    }

    if (section) {
        sql += "section = ?, ";
        values.push(section);
    }

    if (file) {
        sql += "file = ?, ";
        values.push(file);
    }

    if (values.length === 0) {
        return res.status(400).json({ message: "No fields to update" });
    }

    sql = sql.slice(0, -2);
    sql += " WHERE id = ?";
    values.push(id);

   db.query(
    "SELECT file FROM homework_upload WHERE id = ?",
    [id],
    (err, rows) => {

        db.end();

        if (err) return res.status(500).json(err);

        res.status(200).json({
            message: "Upload updated successfully",
            updatedFile: file || rows[0]?.file || null
        });
    }
);
};

/* ================= DELETE UPLOAD ================= */
export const deleteUploadHomework = (req, res) => {

    const db = getDB(req);

    const { id } = req.params;

    db.query(
        "DELETE FROM homework_upload WHERE id = ?",
        [id],
        (err) => {

            db.end();

            if (err) return res.status(500).json(err);

            res.status(200).json({
                message: "Upload deleted"
            });
        }
    );
};