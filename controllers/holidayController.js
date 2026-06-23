import { getSchoolDB } from "../config/schoolDb.js";

const getDB = (req) => getSchoolDB(req.databaseName);

/* ================= CREATE HOLIDAY ================= */
export const createHoliday = (req, res) => {

    const db = getDB(req);

    const { event_name, holiday_date } = req.body || {};

    if (!event_name || !holiday_date) {

        db.end();

        return res.status(400).json({
            message: "All fields required"
        });
    }

    const sql = `
        INSERT INTO holiday_calendar
        (event_name, holiday_date)
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [event_name, holiday_date],
        (err, result) => {

            db.end();

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Holiday added",
                id: result.insertId
            });
        }
    );
};


/* ================= GET HOLIDAYS ================= */
export const getHolidays = (req, res) => {

    const db = getDB(req);

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

        db.end();

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            total: result.length,
            data: result
        });
    });
};


/* ================= UPDATE HOLIDAY ================= */
export const updateHoliday = (req, res) => {

    const db = getDB(req);

    const { id } = req.params;
    const { event_name, holiday_date } = req.body;

    if (!id) {

        db.end();

        return res.status(400).json({
            message: "Holiday ID is required"
        });
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

            db.end();

            return res.status(400).json({
                message: "Invalid holiday_date"
            });
        }

        sql += "holiday_date = ?, ";
        values.push(holiday_date);
    }

    if (values.length === 0) {

        db.end();

        return res.status(400).json({
            message: "No fields to update"
        });
    }

    sql = sql.slice(0, -2);
    sql += " WHERE id = ?";
    values.push(id);

    db.query(sql, values, (err, result) => {

        db.end();

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Holiday not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Holiday updated successfully"
        });
    });
};


/* ================= DELETE HOLIDAY ================= */
export const deleteHoliday = (req, res) => {

    const db = getDB(req);

    const { id } = req.params;

    db.query(
        "DELETE FROM holiday_calendar WHERE id = ?",
        [id],
        (err, result) => {

            db.end();

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Holiday not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Holiday deleted successfully"
            });
        }
    );
};