import db from "../db.js";

export const createTask = (req, res) => {
    let { id, subject, topic, description, due_date, class: className, section } = req.body;

    if (!subject || !topic || !className || !section) {
        return res.status(400).json({ message: "subject, topic, class, and section are required" });
    }

    const parsedDate = new Date(due_date);
    if (!due_date || isNaN(parsedDate)) {
        return res.status(400).json({ message: "Valid due_date required" });
    }

    const formattedDate = parsedDate.toISOString().slice(0, 19).replace("T", " ");

    const sql = id
        ? `INSERT INTO tasks (id, subject, topic, description, class, section, due_date)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        : `INSERT INTO tasks (subject, topic, description, class, section, due_date)
           VALUES (?, ?, ?, ?, ?, ?)`;

    const values = id
        ? [id, subject, topic, description, className, section, formattedDate]
        : [subject, topic, description, className, section, formattedDate];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(201).json({
            message: "Task created",
            id: id || result.insertId
        });
    });
};

export const getTasks = (req, res) => {
    const { id, class: className, section } = req.query;

    let sql = "SELECT * FROM tasks WHERE 1=1";
    let values = [];

    if (id) {
        sql += " AND id = ?";
        values.push(id);
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

export const updateTask = (req, res) => {
    const { id } = req.params;
    const { subject, topic, description, due_date, class: className, section } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Task ID is required" });
    }

    let formattedDate = null;
    if (due_date) {
        const parsedDate = new Date(due_date);
        if (isNaN(parsedDate)) {
            return res.status(400).json({ message: "Invalid due_date" });
        }
        formattedDate = parsedDate.toISOString().slice(0, 19).replace("T", " ");
    }

    const sql = `
        UPDATE tasks 
        SET subject = ?, topic = ?, description = ?, class = ?, section = ?, due_date = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [subject, topic, description, className, section, formattedDate, id],
        (err, result) => {
            if (err) return res.status(500).json(err);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Task not found" });
            }

            db.query("SELECT * FROM tasks WHERE id = ?", [id], (err, rows) => {
                if (err) return res.status(500).json(err);

                res.json({
                    message: "Task updated successfully",
                    data: rows[0]
                });
            });
        }
    );
};

export const deleteTask = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Task deleted" });
    });
};