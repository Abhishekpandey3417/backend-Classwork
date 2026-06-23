import { getSchoolDB } from "../config/schoolDb.js";

const getDB = (req) => getSchoolDB(req.databaseName);

/* ================= CREATE DOUBT ================= */
export const createAcademicDoubt = async (req, res) => {
    try {
        const db = getDB(req);

        const {
            subject_name,
            topic_name,
            your_doubt
        } = req.body;

        if (!subject_name || !your_doubt) {
            db.end();
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

        const [result] = await db.promise().query(
            sql,
            [
                subject_name,
                topic_name || null,
                your_doubt
            ]
        );

        db.end();

        res.status(201).json({
            message: "Academic doubt created successfully",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


/* ================= GET DOUBTS ================= */
export const getAcademicDoubt = async (req, res) => {
    try {
        const db = getDB(req);

        const { id } = req.query;

        let sql = "SELECT * FROM academic_doubt";
        let values = [];

        if (id) {
            sql += " WHERE id = ?";
            values.push(id);
        }

        sql += " ORDER BY id DESC";

        const [rows] = await db.promise().query(sql, values);

        db.end();

        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


/* ================= UPDATE DOUBT ================= */
export const updateAcademicDoubt = async (req, res) => {
    try {
        const db = getDB(req);

        const { id } = req.params;

        const {
            subject_name,
            topic_name,
            your_doubt
        } = req.body;

        let sql = "UPDATE academic_doubt SET ";
        let values = [];

        if (subject_name !== undefined) {
            sql += "subject_name = ?, ";
            values.push(subject_name);
        }

        if (topic_name !== undefined) {
            sql += "topic_name = ?, ";
            values.push(topic_name);
        }

        if (your_doubt !== undefined) {
            sql += "your_doubt = ?, ";
            values.push(your_doubt);
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
                message: "Academic doubt not found"
            });
        }

        res.status(200).json({
            message: "Academic doubt updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


/* ================= DELETE DOUBT ================= */
export const deleteAcademicDoubt = async (req, res) => {
    try {
        const db = getDB(req);

        const { id } = req.params;

        const [result] = await db.promise().query(
            "DELETE FROM academic_doubt WHERE id = ?",
            [id]
        );

        db.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Academic doubt not found"
            });
        }

        res.status(200).json({
            message: "Academic doubt deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};