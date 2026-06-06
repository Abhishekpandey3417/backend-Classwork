import db from "../config/db.js";

/* ================= CREATE ASSIGNMENT ================= */
export const createAssignment = (req, res) => {
    const {
        subject_name,
        project_title,
        task_description,
        total_marks,
        due_date,
        class: className,
        section
    } = req.body;

    if (!due_date || !className || !section) {
        return res.status(400).json({ message: "due_date, class and section are required" });
    }

    // Format date
    let formattedDate;
    if (due_date.includes("-")) {
        const parts = due_date.split("-");
        if (parts[0].length === 2) {
            formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else {
            formattedDate = due_date;
        }
    }

    const parsedDate = new Date(formattedDate);
    if (isNaN(parsedDate)) {
        return res.status(400).json({ message: "Invalid due_date format" });
    }

    const sql = `
        INSERT INTO assignments 
        (subject_name, project_title, task_description, total_marks, due_date, class, section)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [subject_name, project_title, task_description, total_marks, formattedDate, className, section],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.status(201).json({
                message: "Assignment created",
                id: result.insertId
            });
        }
    );
};

/* ================= GET ASSIGNMENTS ================= */
export const getAssignments = (req, res) => {
    const { class: className, section } = req.query;

    let sql = "SELECT * FROM assignments WHERE 1=1";
    let values = [];

    if (className) {
        sql += " AND class = ?";
        values.push(className);
    }

    if (section) {
        sql += " AND section = ?";
        values.push(section);
    }

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(result);
    });
};

/* ================= SEARCH ASSIGNMENTS ================= */
export const searchAssignments = (req, res) => {
    const { subject_name, project_title, class: className, section } = req.query;

    let sql = "SELECT * FROM assignments WHERE 1=1";
    let values = [];

    if (subject_name || project_title) {
        sql += " AND (";

        if (subject_name && project_title) {
            sql += "subject_name LIKE ? OR project_title LIKE ?";
            values.push(`%${subject_name}%`, `%${project_title}%`);
        } else if (subject_name) {
            sql += "subject_name LIKE ?";
            values.push(`%${subject_name}%`);
        } else if (project_title) {
            sql += "project_title LIKE ?";
            values.push(`%${project_title}%`);
        }

        sql += ")";
    }

    if (className) {
        sql += " AND class = ?";
        values.push(className);
    }

    if (section) {
        sql += " AND section = ?";
        values.push(section);
    }

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(result);
    });
};

/* ================= UPDATE ASSIGNMENT ================= */
export const updateAssignment = (req, res) => {
    const { id } = req.params;
    const {
        subject_name,
        project_title,
        task_description,
        total_marks,
        due_date,
        class: className,
        section
    } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Assignment ID is required" });
    }

    const sql = `
        UPDATE assignments
        SET subject_name=?, project_title=?, task_description=?, total_marks=?, due_date=?, class=?, section=?
        WHERE id=?
    `;

    db.query(
        sql,
        [subject_name, project_title, task_description, total_marks, due_date, className, section, id],
        (err, result) => {
            if (err) return res.status(500).json(err);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Assignment not found" });
            }

            res.status(200).json({ message: "Assignment updated" });
        }
    );
};

/* ================= DELETE ASSIGNMENT ================= */
export const deleteAssignment = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Assignment ID is required" });
    }

    db.query("DELETE FROM assignments WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        res.status(200).json({ message: "Assignment deleted" });
    });
};