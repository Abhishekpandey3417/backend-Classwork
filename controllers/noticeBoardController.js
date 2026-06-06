import db from "../config/db.js";

/* ================= CREATE NOTICE ================= */
export const createNoticeBoard = (req, res) => {
    const { title, department, topic, description, date_posted } = req.body || {};

    const parsedDate = new Date(date_posted);
    if (!date_posted || isNaN(parsedDate)) {
        return res.status(400).json({ message: "Valid date_posted required" });
    }

    const formattedDate = parsedDate.toISOString().slice(0, 19).replace("T", " ");

    const sql = `
        INSERT INTO notice_board 
        (title, department, topic, description, date_posted)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [title, department, topic, description, formattedDate], (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(201).json({
            message: "Notice added",
            id: result.insertId
        });
    });
};


/* ================= GET ALL / BY ID ================= */
export const getNoticeBoard = (req, res) => {
    const { id } = req.query;

    let sql = "SELECT * FROM notice_board ORDER BY date_posted DESC";
    let values = [];

    if (id) {
        sql = "SELECT * FROM notice_board WHERE id = ?";
        values.push(id);
    }

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(200).json(result);
    });
};


/* ================= UPDATE ================= */
export const updateNoticeBoard = (req, res) => {
    const { id } = req.params;
    const { title, department, topic, description, date_posted } = req.body || {};

    if (!id) {
        return res.status(400).json({ message: "Notice ID required" });
    }

    let sql = "UPDATE notice_board SET ";
    let values = [];

    if (title) {
        sql += "title = ?, ";
        values.push(title);
    }

    if (department) {
        sql += "department = ?, ";
        values.push(department);
    }

    if (topic) {
        sql += "topic = ?, ";
        values.push(topic);
    }

    if (description) {
        sql += "description = ?, ";
        values.push(description);
    }

    if (date_posted) {
        const parsedDate = new Date(date_posted);
        if (isNaN(parsedDate)) {
            return res.status(400).json({ message: "Invalid date_posted" });
        }

        const formattedDate = parsedDate.toISOString().slice(0, 19).replace("T", " ");
        sql += "date_posted = ?, ";
        values.push(formattedDate);
    }

    if (values.length === 0) {
        return res.status(400).json({ message: "No fields provided" });
    }

    sql = sql.slice(0, -2);
    sql += " WHERE id = ?";
    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Notice not found" });
        }

        res.status(200).json({ message: "Notice updated" });
    });
};


/* ================= DELETE ================= */
export const deleteNoticeBoard = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM notice_board WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Notice not found" });
        }

        res.status(200).json({ message: "Notice deleted" });
    });
};