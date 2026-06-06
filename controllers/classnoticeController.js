import db from "../config/db.js";

export const createNotice = (req, res) => {

    const {
        class: className,
        section,
        event_name,
        description,
        remark,
        date_posted
    } = req.body || {};

    // ✅ check required fields
    if (!className || !section || !event_name || !date_posted) {
        return res.status(400).json({ message: "All required fields must be provided" });
    }

    // ✅ CLEAN + SAFE DATE PARSE
    const parsedDate = new Date(String(date_posted).trim());

    if (!date_posted || isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Valid date_posted required" });
    }

    const formattedDate = parsedDate.toISOString().slice(0, 19).replace("T", " ");

    const sql = `
        INSERT INTO classnotice 
        (\`class\`, section, event_name, description, remark, date_posted)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [className, section, event_name, description, remark, formattedDate],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.status(201).json({
                message: "Notice created",
                id: result.insertId
            });
        }
    );

};


/* ================= GET NOTICE ================= */
export const getNotices = (req, res) => {
    const { id } = req.query;

    let sql = "SELECT * FROM classnotice";
    let values = [];

    if (id) {
        sql += " WHERE id = ?";
        values.push(id);
    }

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(result);
    });
};


/* ================= UPDATE NOTICE ================= */
export const updateNotice = (req, res) => {
    const { id } = req.params;
    const { class: className, section, event_name, description, remark, date_posted } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Notice ID is required" });
    }

    let sql = "UPDATE classnotice SET ";
    let values = [];

    if (className) {
        sql += "`class` = ?, ";
        values.push(className);
    }

    if (section) {
        sql += "section = ?, ";
        values.push(section);
    }

    if (event_name) {
        sql += "event_name = ?, ";
        values.push(event_name);
    }

    if (description) {
        sql += "description = ?, ";
        values.push(description);
    }

    if (remark) {
        sql += "remark = ?, ";
        values.push(remark);
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
        return res.status(400).json({ message: "No fields provided to update" });
    }

    sql = sql.slice(0, -2);
    sql += " WHERE id = ?";
    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Notice not found" });
        }

        res.status(200).json({ message: "Notice updated successfully" });
    });
};


/* ================= DELETE NOTICE ================= */
export const deleteNotice = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM classnotice WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Notice not found" });
        }

        res.status(200).json({ message: "Notice deleted successfully" });
    });
};