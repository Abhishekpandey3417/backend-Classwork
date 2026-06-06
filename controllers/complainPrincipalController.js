import db from "../config/db.js";


/* ================= CREATE COMPLAINT ================= */
export const createComplaint = (req, res) => {

    const {
        subject,
        complaint_description
    } = req.body;

    if (!subject || !complaint_description) {
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

    db.query(
        sql,
        [subject, complaint_description],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Complaint submitted successfully",
                id: result.insertId
            });
        }
    );
};



/* ================= GET ALL / GET BY ID ================= */
export const getComplaint = (req, res) => {

    const { id } = req.query;

    let sql = "SELECT * FROM complain_principal";
    let values = [];

    if (id) {
        sql += " WHERE id = ?";
        values.push(id);
    }

    sql += " ORDER BY id DESC";

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);
    });
};



/* ================= UPDATE COMPLAINT ================= */
export const updateComplaint = (req, res) => {

    const { id } = req.params;

    const {
        subject,
        complaint_description
    } = req.body;

    let sql = "UPDATE complain_principal SET ";
    let values = [];

    if (subject) {
        sql += "subject = ?, ";
        values.push(subject);
    }

    if (complaint_description) {
        sql += "complaint_description = ?, ";
        values.push(complaint_description);
    }

    if (values.length === 0) {
        return res.status(400).json({
            message: "No fields provided for update"
        });
    }

    sql = sql.slice(0, -2);

    sql += " WHERE id = ?";
    values.push(id);

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            message: "Complaint updated successfully"
        });
    });
};



/* ================= DELETE COMPLAINT ================= */
export const deleteComplaint = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM complain_principal WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Complaint not found"
                });
            }

            res.status(200).json({
                message: "Complaint deleted successfully"
            });
        }
    );
};