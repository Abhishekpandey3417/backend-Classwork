import db from "../db.js";

/* ================= CREATE TIMETABLE ================= */
export const createTimetable = (req, res) => {
    const {
        class: className,
        section,
        day_name,
        period_name,
        subject_name,
        subject_teacher
    } = req.body || {};

    const sql = `
        INSERT INTO timetable
        (class, section, day_name, period_name, subject_name, subject_teacher)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            className,
            section,
            day_name,
            period_name,
            subject_name,
            subject_teacher
        ],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.status(201).json({
                message: "Timetable created successfully",
                id: result.insertId
            });
        }
    );
};


/* ================= GET TIMETABLE ================= */
export const getTimetable = (req, res) => {
    const { id, class: className, section, day_name } = req.query;

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

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(200).json(result);
    });
};


/* ================= UPDATE TIMETABLE ================= */
export const updateTimetable = (req, res) => {
    const { id } = req.params;

    const {
        class: className,
        section,
        day_name,
        period_name,
        subject_name,
        subject_teacher
    } = req.body || {};

    if (!id) {
        return res.status(400).json({
            message: "Timetable ID required"
        });
    }

    let sql = "UPDATE timetable SET ";
    let values = [];

    if (className) {
        sql += "`class` = ?, ";
        values.push(className);
    }

    if (section) {
        sql += "section = ?, ";
        values.push(section);
    }

    if (day_name) {
        sql += "day_name = ?, ";
        values.push(day_name);
    }

    if (period_name) {
        sql += "period_name = ?, ";
        values.push(period_name);
    }

    if (subject_name) {
        sql += "subject_name = ?, ";
        values.push(subject_name);
    }

    if (subject_teacher) {
        sql += "subject_teacher = ?, ";
        values.push(subject_teacher);
    }

    if (values.length === 0) {
        return res.status(400).json({
            message: "No fields provided"
        });
    }

    sql = sql.slice(0, -2);

    sql += " WHERE id = ?";
    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Timetable not found"
            });
        }

        res.status(200).json({
            message: "Timetable updated successfully"
        });
    });
};


/* ================= DELETE TIMETABLE ================= */
export const deleteTimetable = (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM timetable WHERE id = ?",
        [id],
        (err, result) => {
            if (err) return res.status(500).json(err);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Timetable not found"
                });
            }

            res.status(200).json({
                message: "Timetable deleted successfully"
            });
        }
    );
};