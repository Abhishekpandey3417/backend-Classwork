import db from "../config/db.js";

export const createHoliday = (req, res) => {
    const { event_name, holiday_date } = req.body || {};

    if (!event_name || !holiday_date) {
        return res.status(400).json({ message: "All fields required" });
    }

    const sql = `
        INSERT INTO holiday_calendar (event_name, holiday_date)
        VALUES (?, ?)
    `;

    db.query(sql, [event_name, holiday_date], (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(201).json({
            message: "Holiday added",
            id: result.insertId
        });
    });
};

export const getHolidays = (req, res) => {
    const { month, year } = req.query;

    let sql = "SELECT * FROM holiday_calendar WHERE 1=1";
    let values = [];

    if (month) {
        sql += " AND MONTH(holiday_date) = ?";
        values.push(month);
    }

    if (year) {
        sql += " AND YEAR(holiday_date) = ?";
        values.push(year);
    }

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(result);
    });
};

export const updateHoliday = (req, res) => {
    const { id } = req.params;
    const { event_name, holiday_date } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Holiday ID is required" });
    }

    let sql = "UPDATE holiday_calendar SET ";
    let values = [];

    if (event_name) {
        sql += "event_name = ?, ";
        values.push(event_name);
    }

    if (holiday_date) {
        const parsedDate = new Date(holiday_date);
        if (isNaN(parsedDate)) {
            return res.status(400).json({ message: "Invalid holiday_date" });
        }
        sql += "holiday_date = ?, ";
        values.push(holiday_date);
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
            return res.status(404).json({ message: "Holiday not found" });
        }

        res.status(200).json({ message: "Holiday updated successfully" });
    });
};

export const deleteHoliday = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM holiday_calendar WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Holiday not found" });
        }

        res.status(200).json({ message: "Holiday deleted successfully" });
    });
};