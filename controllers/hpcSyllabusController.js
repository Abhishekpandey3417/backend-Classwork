import db from "../db.js";

/* ================= CREATE HPC SYLLABUS ================= */
export const createHPCSyllabus = (req, res) => {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
        session,
        class: className,
        section,
        syllabus_title,
        description,
        uploaded_by
    } = req.body;

    const file = req.file ? req.file.filename : null;

    if (!session || !className || !section || !file) {
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

    db.query(
        sql,
        [
            session,
            className,
            section,
            syllabus_title,
            description,
            uploaded_by,
            file
        ],
        (err, result) => {

            if (err) {
                console.log("MYSQL ERROR:", err);
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "HPC syllabus uploaded successfully",
                id: result.insertId,
                file
            });

        }
    );
};


/* ================= GET HPC SYLLABUS ================= */
export const getHPCSyllabus = (req, res) => {

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

    db.query(sql, values, (err, result) => {

        if (err) {
            console.log("MYSQL ERROR:", err);
            return res.status(500).json(err);
        }

        const updatedResult = result.map(item => ({
            ...item,
            file_url: item.file
                ? `${req.protocol}://${req.get("host")}/uploads/${item.file}`
                : null
        }));

        res.status(200).json(updatedResult);

    });
};


/* ================= UPDATE HPC SYLLABUS ================= */
export const updateHPCSyllabus = (req, res) => {

    const { id } = req.params;

    const {
        session,
        class: className,
        section,
        syllabus_title,
        description,
        uploaded_by
    } = req.body;

    const file = req.file ? req.file.filename : null;

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

    db.query(sql, values, (err, result) => {

        if (err) {
            console.log("MYSQL ERROR:", err);
            return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "HPC syllabus not found"
            });
        }

        res.status(200).json({
            message: "HPC syllabus updated successfully"
        });

    });
};


/* ================= DELETE HPC SYLLABUS ================= */
export const deleteHPCSyllabus = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM hpc_syllabus WHERE id=?",
        [id],
        (err, result) => {

            if (err) {
                console.log("MYSQL ERROR:", err);
                return res.status(500).json(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "HPC syllabus not found"
                });
            }

            res.status(200).json({
                message: "HPC syllabus deleted successfully"
            });

        }
    );
};