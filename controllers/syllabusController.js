
import { getSchoolDB } from "../config/schoolDb.js";
const getDB = (req) => getSchoolDB(req.databaseName);

/* ================= CREATE SYLLABUS ================= */
export const createSyllabus = (req, res) => {

    const db = getDB(req);

    try {

        const {
            session,
            class: className,
            section,
            subject_name,
            chapter_name,
            topic_name,
            description,
            start_date,
            end_date,
            learning_outcome,
            reference_material,
            status
        } = req.body;

        const file = req.file ? req.file.path : null;

        const sql = `
            INSERT INTO syllabus
            (
                session,
                class,
                section,
                subject_name,
                chapter_name,
                topic_name,
                description,
                start_date,
                end_date,
                learning_outcome,
                reference_material,
                status,
                file
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                session,
                className,
                section,
                subject_name,
                chapter_name,
                topic_name,
                description,
                start_date,
                end_date,
                learning_outcome,
                reference_material,
                status || "Planned",
                file
            ],
            (err, result) => {

                db.end();

                if (err) {
                    console.log("MYSQL ERROR:", err);

                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }

                res.status(201).json({
                    success: true,
                    message: "Syllabus created successfully",
                    id: result.insertId,
                    file
                });
            }
        );

    } catch (error) {

        db.end();

        console.log("SERVER ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/* ================= GET ALL / GET BY ID ================= */
export const getSyllabus = (req, res) => {

    const db = getDB(req);

    try {

        const { id } = req.query;

        let sql = "SELECT * FROM syllabus";
        let values = [];

        if (id) {
            sql += " WHERE id = ?";
            values.push(id);
        }

        sql += " ORDER BY id DESC";

        db.query(sql, values, (err, result) => {

            db.end();

            if (err) {
                console.log("MYSQL ERROR:", err);

                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.status(200).json({
                success: true,
                total: result.length,
                data: result
            });
        });

    } catch (error) {

        db.end();

        console.log("SERVER ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/* ================= SEARCH SYLLABUS ================= */
export const searchSyllabus = (req, res) => {

    const db = getDB(req);

    try {

        const {
            class: className,
            section,
            subject_name,
            session
        } = req.query;

        let sql = "SELECT * FROM syllabus WHERE 1=1";
        let values = [];

        if (className) {
            sql += " AND class = ?";
            values.push(className);
        }

        if (section) {
            sql += " AND section = ?";
            values.push(section);
        }

        if (subject_name) {
            sql += " AND subject_name LIKE ?";
            values.push(`%${subject_name}%`);
        }

        if (session) {
            sql += " AND session = ?";
            values.push(session);
        }

        sql += " ORDER BY id DESC";

        db.query(sql, values, (err, result) => {

            db.end();

            if (err) {
                console.log("MYSQL ERROR:", err);

                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.status(200).json({
                success: true,
                total: result.length,
                data: result
            });
        });

    } catch (error) {

        db.end();

        console.log("SERVER ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/* ================= UPDATE SYLLABUS ================= */
export const updateSyllabus = (req, res) => {

    const db = getDB(req);

    try {

        const { id } = req.params;

        const {
            session,
            class: className,
            section,
            subject_name,
            chapter_name,
            topic_name,
            description,
            start_date,
            end_date,
            learning_outcome,
            reference_material,
            status
        } = req.body;

        const file = req.file ? req.file.filename : null;

        let sql = `UPDATE syllabus SET `;

        let updates = [];
        let values = [];

        if (session) {
            updates.push("session=?");
            values.push(session);
        }

        if (className) {
            updates.push("class=?");
            values.push(className);
        }

        if (section) {
            updates.push("section=?");
            values.push(section);
        }

        if (subject_name) {
            updates.push("subject_name=?");
            values.push(subject_name);
        }

        if (chapter_name) {
            updates.push("chapter_name=?");
            values.push(chapter_name);
        }

        if (topic_name) {
            updates.push("topic_name=?");
            values.push(topic_name);
        }

        if (description) {
            updates.push("description=?");
            values.push(description);
        }

        if (start_date) {
            updates.push("start_date=?");
            values.push(start_date);
        }

        if (end_date) {
            updates.push("end_date=?");
            values.push(end_date);
        }

        if (learning_outcome) {
            updates.push("learning_outcome=?");
            values.push(learning_outcome);
        }

        if (reference_material) {
            updates.push("reference_material=?");
            values.push(reference_material);
        }

        if (status) {
            updates.push("status=?");
            values.push(status);
        }

        if (file) {
            updates.push("file=?");
            values.push(file);
        }

        if (updates.length === 0) {

            db.end();

            return res.status(400).json({
                success: false,
                message: "No fields provided for update"
            });
        }

        sql += updates.join(", ");
        sql += " WHERE id=?";

        values.push(id);

        db.query(sql, values, (err, result) => {

            db.end();

            if (err) {
                console.log("MYSQL ERROR:", err);

                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Syllabus not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Syllabus updated successfully"
            });
        });

    } catch (error) {

        db.end();

        console.log("SERVER ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/* ================= DELETE SYLLABUS ================= */
export const deleteSyllabus = (req, res) => {

    const db = getDB(req);

    try {

        const { id } = req.params;

        db.query(
            "DELETE FROM syllabus WHERE id=?",
            [id],
            (err, result) => {

                db.end();

                if (err) {
                    console.log("MYSQL ERROR:", err);

                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Syllabus not found"
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Syllabus deleted successfully"
                });
            }
        );

    } catch (error) {

        db.end();

        console.log("SERVER ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


