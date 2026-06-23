
import { getSchoolDB } from "../config/schoolDb.js";

const getDB = (req) => getSchoolDB(req.databaseName);

/* ================= CREATE SCHOOL NOTICE ================= */
export const createSchoolNotice = (req, res) => {

    const db = getDB(req);

    const { heading, notice, date } = req.body || {};

    if (!heading || !notice || !date) {
        db.end();
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) {
        db.end();
        return res.status(400).json({
            message: "Invalid date format"
        });
    }

    const sql = `
        INSERT INTO school_notice
        (
            heading,
            notice,
            notice_date
        )
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [heading, notice, date],
        (err, result) => {

            db.end();

            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Notice created successfully",
                id: result.insertId
            });
        }
    );
};

/* ================= GET SCHOOL NOTICES ================= */
export const getSchoolNotices = (req, res) => {

    const db = getDB(req);

    const { id } = req.query;

    let sql = "SELECT * FROM school_notice";
    let values = [];

    if (id) {
        sql += " WHERE id = ?";
        values.push(id);
    }

    db.query(sql, values, (err, result) => {

        db.end();

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);
    });
};

/* ================= UPDATE SCHOOL NOTICE ================= */
export const updateSchoolNotice = (req, res) => {

    const db = getDB(req);

    const { id } = req.params;

    const { heading, notice, date } = req.body || {};

    if (!id) {
        db.end();
        return res.status(400).json({
            message: "Notice ID required"
        });
    }

    let sql = "UPDATE school_notice SET ";
    let values = [];

    if (heading) {
        sql += "heading = ?, ";
        values.push(heading);
    }

    if (notice) {
        sql += "notice = ?, ";
        values.push(notice);
    }

    if (date) {

        const parsedDate = new Date(date);

        if (isNaN(parsedDate)) {
            db.end();
            return res.status(400).json({
                message: "Invalid date"
            });
        }

        sql += "notice_date = ?, ";
        values.push(date);
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
            return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Notice not found"
            });
        }

        res.status(200).json({
            message: "Notice updated successfully"
        });
    });
};

/* ================= DELETE SCHOOL NOTICE ================= */
export const deleteSchoolNotice = (req, res) => {

    const db = getDB(req);

    const { id } = req.params;

    db.query(
        "DELETE FROM school_notice WHERE id = ?",
        [id],
        (err, result) => {

            db.end();

            if (err) {
                return res.status(500).json(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Notice not found"
                });
            }

            res.status(200).json({
                message: "Notice deleted successfully"
            });
        }
    );
};