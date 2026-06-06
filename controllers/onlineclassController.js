import db from "../config/db.js";


/* ================= CREATE ONLINE CLASS ================= */
export const createOnlineClass = (req, res) => {

    const {
        class: className,
        section,
        subject_name,
        topic_name,
        teacher_name,
        meeting_platform,
        online_link,
        class_date,
        class_time,
        duration_minutes,
        description,
        remark
    } = req.body;

    if (
        !className ||
        !section ||
        !subject_name ||
        !online_link ||
        !class_date ||
        !class_time
    ) {
        return res.status(400).json({
            message: "Required fields missing"
        });
    }

    const sql = `
        INSERT INTO online_classes
        (
            class,
            section,
            subject_name,
            topic_name,
            teacher_name,
            meeting_platform,
            online_link,
            class_date,
            class_time,
            duration_minutes,
            description,
            remark
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            className,
            section,
            subject_name,
            topic_name,
            teacher_name,
            meeting_platform,
            online_link,
            class_date,
            class_time,
            duration_minutes,
            description,
            remark
        ],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.status(201).json({
                message: "Online class created successfully",
                id: result.insertId
            });

        }
    );
};



/* ================= GET ONLINE CLASSES ================= */
export const getOnlineClasses = (req, res) => {

    const {
        id,
        class: className,
        section,
        subject_name,
        class_date
    } = req.query;

    let sql = "SELECT * FROM online_classes WHERE 1=1";
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

    if (subject_name) {
        sql += " AND subject_name LIKE ?";
        values.push(`%${subject_name}%`);
    }

    if (class_date) {
        sql += " AND class_date = ?";
        values.push(class_date);
    }

    db.query(sql, values, (err, result) => {

        if (err) return res.status(500).json(err);

        res.status(200).json(result);

    });
};



/* ================= UPDATE ONLINE CLASS ================= */
export const updateOnlineClass = (req, res) => {

    const { id } = req.params;

    const {
        class: className,
        section,
        subject_name,
        topic_name,
        teacher_name,
        meeting_platform,
        online_link,
        class_date,
        class_time,
        duration_minutes,
        description,
        remark
    } = req.body;

    const sql = `
        UPDATE online_classes
        SET
            class=?,
            section=?,
            subject_name=?,
            topic_name=?,
            teacher_name=?,
            meeting_platform=?,
            online_link=?,
            class_date=?,
            class_time=?,
            duration_minutes=?,
            description=?,
            remark=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            className,
            section,
            subject_name,
            topic_name,
            teacher_name,
            meeting_platform,
            online_link,
            class_date,
            class_time,
            duration_minutes,
            description,
            remark,
            id
        ],
        (err, result) => {

            if (err) return res.status(500).json(err);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Online class not found"
                });
            }

            res.status(200).json({
                message: "Online class updated successfully"
            });

        }
    );
};



/* ================= DELETE ONLINE CLASS ================= */
export const deleteOnlineClass = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM online_classes WHERE id=?",
        [id],
        (err, result) => {

            if (err) return res.status(500).json(err);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Online class not found"
                });
            }

            res.status(200).json({
                message: "Online class deleted successfully"
            });

        }
    );
};