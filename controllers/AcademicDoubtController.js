import db from "../db.js";


/* ================= CREATE DOUBT ================= */
export const createAcademicDoubt = (req, res) => {

    const {
        subject_name,
        topic_name,
        your_doubt
    } = req.body;

    if (!subject_name || !your_doubt) {
        return res.status(400).json({
            message: "Subject and doubt are required"
        });
    }

    const sql = `
        INSERT INTO academic_doubt
        (
            subject_name,
            topic_name,
            your_doubt
        )
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            subject_name,
            topic_name,
            your_doubt
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Academic doubt created successfully",
                id: result.insertId
            });
        }
    );
};



/* ================= GET ALL / GET BY ID ================= */
export const getAcademicDoubt = (req, res) => {

    const { id } = req.query;

    let sql = "SELECT * FROM academic_doubt";
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



/* ================= UPDATE DOUBT ================= */
export const updateAcademicDoubt = (req, res) => {

    const { id } = req.params;

    const {
        subject_name,
        topic_name,
        your_doubt
    } = req.body;

    let sql = "UPDATE academic_doubt SET ";
    let values = [];

    if (subject_name) {
        sql += "subject_name = ?, ";
        values.push(subject_name);
    }

    if (topic_name) {
        sql += "topic_name = ?, ";
        values.push(topic_name);
    }

    if (your_doubt) {
        sql += "your_doubt = ?, ";
        values.push(your_doubt);
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
                message: "Academic doubt not found"
            });
        }

        res.status(200).json({
            message: "Academic doubt updated successfully"
        });
    });
};



/* ================= DELETE DOUBT ================= */
export const deleteAcademicDoubt = (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM academic_doubt WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Academic doubt not found"
            });
        }

        res.status(200).json({
            message: "Academic doubt deleted successfully"
        });
    });
};