import { getSchoolDB } from "../config/schoolDb.js";

const getDB = (req) => getSchoolDB(req.databaseName);


/* ================= CREATE COMPLAINT ================= */
export const createComplaint = async (req, res) => {
    try {
        const db = getDB(req);

        const {
            subject,
            complaint_description
        } = req.body;

        if (!subject || !complaint_description) {
            db.end();
            return res.status(400).json({
                message: "Subject and complaint description are required"
            });
        }

        const sql = `
            INSERT INTO complain_principal
            (
                subject,
                complaint_description
            )
            VALUES (?, ?)
        `;

        const [result] = await db.promise().query(
            sql,
            [subject, complaint_description]
        );

        db.end();

        res.status(201).json({
            message: "Complaint submitted successfully",
            id: result.insertId
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


/* ================= GET ALL / GET BY ID ================= */
export const getComplaint = async (req, res) => {
    try {
        const db = getDB(req);

        const { id } = req.query;

        let sql = "SELECT * FROM complain_principal";
        let values = [];

        if (id) {
            sql += " WHERE id = ?";
            values.push(id);
        }

        sql += " ORDER BY id DESC";

        const [result] = await db.promise().query(sql, values);

        db.end();

        res.status(200).json(result);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


/* ================= UPDATE COMPLAINT ================= */
export const updateComplaint = async (req, res) => {
    try {
        const db = getDB(req);

        const { id } = req.params;

        const {
            subject,
            complaint_description
        } = req.body;

        let sql = "UPDATE complain_principal SET ";
        let values = [];

        if (subject !== undefined) {
            sql += "subject = ?, ";
            values.push(subject);
        }

        if (complaint_description !== undefined) {
            sql += "complaint_description = ?, ";
            values.push(complaint_description);
        }

        if (values.length === 0) {
            db.end();
            return res.status(400).json({
                message: "No fields provided for update"
            });
        }

        sql = sql.slice(0, -2);
        sql += " WHERE id = ?";
        values.push(id);

        const [result] = await db.promise().query(sql, values);

        db.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            message: "Complaint updated successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


/* ================= DELETE COMPLAINT ================= */
export const deleteComplaint = async (req, res) => {
    try {
        const db = getDB(req);

        const { id } = req.params;

        const [result] = await db.promise().query(
            "DELETE FROM complain_principal WHERE id = ?",
            [id]
        );

        db.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            message: "Complaint deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};