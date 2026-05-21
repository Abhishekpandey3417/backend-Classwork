import db from "../db.js";



/* ================= CREATE HOMEWORK ================= */
export const createHomework = async (req, res) => {
    const {
        subject_name,
        topic_name,
        description,
        due_date,
        class: className,
        section
    } = req.body;

    try {
        const [result] = await db.promise().query(
            `INSERT INTO homework_list 
            (subject_name, topic_name, description, due_date, class, section) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [subject_name, topic_name, description, due_date, className, section]
        );

        res.status(201).json({
            message: "Homework created successfully",
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/* ================= GET HOMEWORK ================= */
export const getHomework = (req, res) => {
    const { id } = req.params;

    let sql = "SELECT * FROM homework_list";
    let values = [];

    // If ID is provided → fetch single
    if (id) {
        sql += " WHERE id = ?";
        values.push(id);
    }

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);

        // If ID was passed but no data found
        if (id && result.length === 0) {
            return res.status(404).json({ message: "Homework not found" });
        }

        // If ID → return single object
        if (id) {
            return res.json(result[0]);
        }

        // If no ID → return all
        res.json(result);
    });
};


export const updateHomework = (req, res) => {
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
    const { id } = req.params;

    db.query("DELETE FROM homework_list WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Homework deleted" });
    });
};

/* ================= UPLOAD HOMEWORK ================= */
export const uploadHomework = (req, res) => {
    const {
        subject_name,
        topic_name,
        task_description,
        submission_dateline,
        class: className,
        section
    } = req.body;

    const parsedDate = new Date(submission_dateline);
    if (!submission_dateline || isNaN(parsedDate)) {
        return res.status(400).json({ message: "Valid submission_dateline required" });
    }

    const formattedDate = parsedDate.toISOString().slice(0, 19).replace("T", " ");

    const file_url = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO homework_upload 
        (subject_name, topic_name, task_description, submission_dateline, file_url, class, section)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [subject_name, topic_name, task_description, formattedDate, file_url, className, section],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.status(201).json({
                message: "Homework submitted successfully",
                id: result.insertId,
                file: file_url
            });
        }
    );
};

/* ================= GET UPLOADS ================= */
export const getUploadsHomeworks = (req, res) => {
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
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

/* ================= UPDATE UPLOAD ================= */
export const updateUploadHomework = (req, res) => {
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
        if (isNaN(parsedDate)) {
            return res.status(400).json({ message: "Valid submission_dateline required" });
        }
        formattedDate = parsedDate.toISOString().slice(0, 19).replace("T", " ");
    }

    const file_url = req.file ? req.file.filename : null;

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

    if (file_url) {
        sql += "file_url = ?, ";
        values.push(file_url);
    }

    if (values.length === 0) {
        return res.status(400).json({ message: "No fields to update" });
    }

    sql = sql.slice(0, -2);
    sql += " WHERE id = ?";
    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Upload not found" });
        }

        db.query("SELECT file_url FROM homework_upload WHERE id = ?", [id], (err, rows) => {
            if (err) return res.status(500).json(err);

            res.status(200).json({
                message: "Upload updated successfully",
                updatedFile: file_url || rows[0]?.file_url || null
            });
        });
    });
};

/* ================= DELETE UPLOAD ================= */
export const deleteUploadHomework = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM homework_upload WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: "Upload deleted" });
    });
};