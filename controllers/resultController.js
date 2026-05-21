import db from "../db.js";

/* ================= CREATE RESULT (WITH PDF UPLOAD) ================= */
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
        return res.status(400).json({ message: "Required fields missing" });
    }

    const sql = `
        INSERT INTO results
        (session, class, section, exam_type, student_name, roll_number,
         total_marks, obtained_marks, grade, remarks, result_file)
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
            if (err) return res.status(500).json(err);

            res.status(201).json({
                message: "Result created successfully",
                id: result.insertId,
                file
            });
        }
    );
};


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

    // Search by ID
    if (id) {
        sql += " AND id = ?";
        values.push(id);
    }

    // Search by Class
    if (className) {
        sql += " AND class = ?";
        values.push(className);
    }

    // Search by Section
    if (section) {
        sql += " AND section = ?";
        values.push(section);
    }

    // Search by Roll Number
    if (roll_number) {
        sql += " AND roll_number = ?";
        values.push(roll_number);
    }

    // Search by Exam Type
    if (exam_type) {
        sql += " AND exam_type = ?";
        values.push(exam_type);
    }

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "No result found"
            });
        }

        res.status(200).json({
            count: result.length,
            data: result
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
        UPDATE results SET 
        session=?, class=?, section=?, exam_type=?,
        student_name=?, roll_number=?,
        total_marks=?, obtained_marks=?, grade=?, remarks=?
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
        sql += ", result_file=?";
        values.push(file);
    }

    sql += " WHERE id=?";
    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Result not found" });
        }

        res.status(200).json({
            message: "Result updated successfully"
        });
    });
};


/* ================= DELETE RESULT ================= */
export const deleteResult = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM results WHERE id=?", [id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Result not found" });
        }

        res.status(200).json({ message: "Result deleted successfully" });
    });
};