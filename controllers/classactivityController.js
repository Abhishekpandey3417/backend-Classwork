import db from "../db.js";

export const createActivity = (req, res) => {
    const { class: className, department, activity_name, activity_date, remark } = req.body || {};

    if (!className || !department || !activity_name || !activity_date) {
        return res.status(400).json({ message: "Required fields missing" });
    }

    const sql = `
        INSERT INTO class_activity (class, department, activity_name, activity_date, remark)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [className, department, activity_name, activity_date, remark], (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(201).json({
            message: "Activity created",
            id: result.insertId
        });
    });
};

export const getActivities = (req, res) => {
    const { class: className } = req.query;

    let sql = "SELECT * FROM class_activity";
    let values = [];

    if (className) {
        sql += " WHERE class = ?";
        values.push(className);
    }

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(result);
    });
};

export const updateActivity = (req, res) => {
    const { id } = req.params;
    const { class: className, department, activity_name, activity_date, remark } = req.body || {};

    if (!id) {
        return res.status(400).json({ message: "Activity ID is required" });
    }

    let sql = "UPDATE class_activity SET ";
    let values = [];

    if (className) {
        sql += "`class` = ?, ";
        values.push(className);
    }

    if (department) {
        sql += "department = ?, ";
        values.push(department);
    }

    if (activity_name) {
        sql += "activity_name = ?, ";
        values.push(activity_name);
    }

    if (activity_date) {
        const parsedDate = new Date(activity_date);
        if (isNaN(parsedDate)) {
            return res.status(400).json({ message: "Invalid activity_date" });
        }
        sql += "activity_date = ?, ";
        values.push(activity_date);
    }

    if (remark) {
        sql += "remark = ?, ";
        values.push(remark);
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
            return res.status(404).json({ message: "Activity not found" });
        }

        res.status(200).json({ message: "Activity updated successfully" });
    });
};


export const deleteActivity = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM class_activity WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Activity not found" });
        }

        res.status(200).json({ message: "Activity deleted successfully" });
    });
};