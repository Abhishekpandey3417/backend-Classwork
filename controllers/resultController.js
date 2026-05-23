import db from "../db.js";

/* ================= CREATE RESULT ================= */
export const createResult = (req, res) => {

    const {
        session,
        class: className,
        section,
        exam_type,
        student_name,
        roll_number,
        total_marks,
        obtained_marks,
        grade,
        remarks
    } = req.body;

    const file = req.file ? req.file.filename : null;

    if (!session || !className || !section || !exam_type) {
        return res.status(400).json({
            message: "Required fields missing"
        });
    }

    const sql = `
        INSERT INTO results
        (
            session,
            class,
            section,
            exam_type,
            student_name,
            roll_number,
            total_marks,
            obtained_marks,
            grade,
            remarks,
            file
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            session,
            className,
            section,
            exam_type,
            student_name,
            roll_number,
            total_marks,
            obtained_marks,
            grade,
            remarks,
            file
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Result created successfully",
                id: result.insertId,
                file
            });

        }
    );
};



/* ================= GET RESULTS ================= */
export const getResults = (req, res) => {

    const {
        id,
        class: className,
        section,
        exam_type,
        roll_number
    } = req.query;

    let sql = "SELECT * FROM results WHERE 1=1";
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

    if (roll_number) {
        sql += " AND roll_number = ?";
        values.push(roll_number);
    }

    if (exam_type) {
        sql += " AND exam_type = ?";
        values.push(exam_type);
    }

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        const updatedResult = result.map(item => ({
            ...item,
            file_url: item.file
                ? `${req.protocol}://${req.get("host")}/uploads/${item.file}`
                : null
        }));

        res.status(200).json({
            count: updatedResult.length,
            data: updatedResult
        });

    });
};



/* ================= UPDATE RESULT ================= */
export const updateResult = (req, res) => {

    const { id } = req.params;

    const {
        session,
        class: className,
        section,
        exam_type,
        student_name,
        roll_number,
        total_marks,
        obtained_marks,
        grade,
        remarks
    } = req.body;

    const file = req.file ? req.file.filename : null;

    let sql = `
        UPDATE results
        SET
            session=?,
            class=?,
            section=?,
            exam_type=?,
            student_name=?,
            roll_number=?,
            total_marks=?,
            obtained_marks=?,
            grade=?,
            remarks=?
    `;

    let values = [
        session,
        className,
        section,
        exam_type,
        student_name,
        roll_number,
        total_marks,
        obtained_marks,
        grade,
        remarks
    ];

    if (file) {
        sql += ", file=?";
        values.push(file);
    }

    sql += " WHERE id=?";
    values.push(id);

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Result not found"
            });
        }

        res.status(200).json({
            message: "Result updated successfully"
        });

    });
};



/* ================= DELETE RESULT ================= */
export const deleteResult = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM results WHERE id=?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Result not found"
                });
            }

            res.status(200).json({
                message: "Result deleted successfully"
            });

        }
    );
};