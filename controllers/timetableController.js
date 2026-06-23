import { getSchoolDB } from "../config/schoolDb.js";

/* ================= CREATE TIMETABLE ================= */
export const createTimetable = async (req, res) => {
    try {

        const db = getSchoolDB(req.databaseName);

        const {
            class: className,
            section,
            day_name,
            period_name,
            subject_name,
            subject_teacher
        } = req.body;

        const [result] = await db.promise().query(
            `INSERT INTO timetable
            (
                class,
                section,
                day_name,
                period_name,
                subject_name,
                subject_teacher
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                className,
                section,
                day_name,
                period_name,
                subject_name,
                subject_teacher
            ]
        );

        db.end();

        res.status(201).json({
            message: "Timetable created successfully",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


/* ================= GET TIMETABLE ================= */
export const getTimetable = async (req, res) => {
    try {

        const db = getSchoolDB(req.databaseName);

        const {
            id,
            class: className,
            section,
            day_name
        } = req.query;

        let sql = "SELECT * FROM timetable WHERE 1=1";
        let values = [];

        if (id) {
            sql += " AND id = ?";
            values.push(id);
        }

        if (className) {
            sql += " AND class = ?";
            values.push(className);
        }

        if (section) {
            sql += " AND section = ?";
            values.push(section);
        }

        if (day_name) {
            sql += " AND day_name = ?";
            values.push(day_name);
        }

        const [rows] = await db.promise().query(sql, values);

        db.end();

        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


/* ================= UPDATE TIMETABLE ================= */
export const updateTimetable = async (req, res) => {
    try {

        const db = getSchoolDB(req.databaseName);

        const { id } = req.params;

        if (!id) {
            db.end();
            return res.status(400).json({
                message: "Timetable ID required"
            });
        }

        const {
            class: className,
            section,
            day_name,
            period_name,
            subject_name,
            subject_teacher
        } = req.body;

        let sql = "UPDATE timetable SET ";
        let values = [];

        if (className !== undefined) {
            sql += "`class`=?, ";
            values.push(className);
        }

        if (section !== undefined) {
            sql += "section=?, ";
            values.push(section);
        }

        if (day_name !== undefined) {
            sql += "day_name=?, ";
            values.push(day_name);
        }

        if (period_name !== undefined) {
            sql += "period_name=?, ";
            values.push(period_name);
        }

        if (subject_name !== undefined) {
            sql += "subject_name=?, ";
            values.push(subject_name);
        }

        if (subject_teacher !== undefined) {
            sql += "subject_teacher=?, ";
            values.push(subject_teacher);
        }

        if (values.length === 0) {
            db.end();
            return res.status(400).json({
                message: "No fields provided"
            });
        }

        sql = sql.slice(0, -2);
        sql += " WHERE id=?";

        values.push(id);

        const [result] = await db.promise().query(sql, values);

        db.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Timetable not found"
            });
        }

        res.status(200).json({
            message: "Timetable updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


/* ================= DELETE TIMETABLE ================= */
export const deleteTimetable = async (req, res) => {
    try {

        const db = getSchoolDB(req.databaseName);

        const { id } = req.params;

        const [result] = await db.promise().query(
            "DELETE FROM timetable WHERE id=?",
            [id]
        );

        db.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Timetable not found"
            });
        }

        res.status(200).json({
            message: "Timetable deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};