import { getSchoolDB } from "../config/schoolDb.js";

const getDB = (req) => getSchoolDB(req.databaseName);

/* ================= CREATE HPC SYLLABUS ================= */
export const createHPCSyllabus = async (req, res) => {
    try {
        const db = getDB(req);

        const {
            session,
            class: className,
            section,
            syllabus_title,
            description,
            uploaded_by
        } = req.body;

        const file = req.file
            ? req.file.path
            : null;

        if (!session || !className || !section || !file) {
            db.end();
            return res.status(400).json({
                message: "Session, class, section and file are required"
            });
        }

        const sql = `
            INSERT INTO hpc_syllabus
            (
                session,
                \`class\`,
                section,
                syllabus_title,
                description,
                uploaded_by,
                file
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.promise().query(
            sql,
            [
                session,
                className,
                section,
                syllabus_title,
                description,
                uploaded_by,
                file
            ]
        );

        db.end();

        res.status(201).json({
            message: "HPC syllabus uploaded successfully",
            id: result.insertId,
            file
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

/* ================= GET HPC SYLLABUS ================= */
export const getHPCSyllabus = async (req, res) => {
    try {

        const db = getDB(req);

        const {
            id,
            session,
            class: className,
            section
        } = req.query;

        let sql = "SELECT * FROM hpc_syllabus WHERE 1=1";
        let values = [];

        if (id) {
            sql += " AND id = ?";
            values.push(id);
        }

        if (session) {
            sql += " AND session = ?";
            values.push(session);
        }

        if (className) {
            sql += " AND `class` = ?";
            values.push(className);
        }

        if (section) {
            sql += " AND section = ?";
            values.push(section);
        }

        const [rows] = await db.promise().query(sql, values);

        db.end();

        const updatedRows = rows.map(item => ({
            ...item,
            file_url: item.file || null
        }));

        res.status(200).json(updatedRows);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

/* ================= UPDATE HPC SYLLABUS ================= */
export const updateHPCSyllabus = async (req, res) => {
    try {

        const db = getDB(req);

        const { id } = req.params;

        const {
            session,
            class: className,
            section,
            syllabus_title,
            description,
            uploaded_by
        } = req.body;

        const file = req.file
            ? req.file.path
            : null;

        let sql = `
            UPDATE hpc_syllabus
            SET
                session=?,
                \`class\`=?,
                section=?,
                syllabus_title=?,
                description=?,
                uploaded_by=?
        `;

        let values = [
            session,
            className,
            section,
            syllabus_title,
            description,
            uploaded_by
        ];

        if (file) {
            sql += ", file=?";
            values.push(file);
        }

        sql += " WHERE id=?";
        values.push(id);

        const [result] = await db.promise().query(sql, values);

        db.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "HPC syllabus not found"
            });
        }

        res.status(200).json({
            message: "HPC syllabus updated successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

/* ================= DELETE HPC SYLLABUS ================= */
export const deleteHPCSyllabus = async (req, res) => {
    try {

        const db = getDB(req);

        const { id } = req.params;

        const [result] = await db.promise().query(
            "DELETE FROM hpc_syllabus WHERE id=?",
            [id]
        );

        db.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "HPC syllabus not found"
            });
        }

        res.status(200).json({
            message: "HPC syllabus deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};