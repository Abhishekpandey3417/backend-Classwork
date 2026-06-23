import { getSchoolDB } from "../config/schoolDb.js";

const getDB = (req) => getSchoolDB(req.databaseName);

/* ================= CREATE ACTIVITY ================= */
export const createActivity = (req, res) => {

    const db = getDB(req);

    const {
        class: className,
        department,
        activity_name,
        activity_date,
        remark
    } = req.body || {};

    const parsedDate = new Date(activity_date);

    if (!activity_date || isNaN(parsedDate)) {

        db.end();

        return res.status(400).json({
            message: "Valid activity_date required"
        });
    }

    const sql = `
        INSERT INTO activity
        (class, department, activity_name, activity_date, remark)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [className, department, activity_name, activity_date, remark],
        (err, result) => {

            db.end();

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Activity created successfully",
                id: result.insertId
            });
        }
    );
};


/* ================= GET ACTIVITIES ================= */
export const getActivities = (req, res) => {

    const db = getDB(req);

    const {
        id,
        class: className,
        department
    } = req.query;

    let sql = "SELECT * FROM activity WHERE 1=1";
    let values = [];

    if (id) {
        sql += " AND id = ?";
        values.push(id);
    }

    if (className) {
        sql += " AND class = ?";
        values.push(className);
    }

    if (department) {
        sql += " AND department = ?";
        values.push(department);
    }

    db.query(sql, values, (err, result) => {

        db.end();

        if (err) {
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
};


/* ================= UPDATE ACTIVITY ================= */
export const updateActivity = (req, res) => {

    const db = getDB(req);

    const { id } = req.params;

    const {
        class: className,
        department,
        activity_name,
        activity_date,
        remark
    } = req.body || {};

    if (!id) {

        db.end();

        return res.status(400).json({
            message: "Activity ID is required"
        });
    }

    let sql = "UPDATE activity SET ";
    let values = [];

    if (className) {
        sql += "`class` = ?, ";
        values.push(className);
    }

    if (department) {
        sql += "department = ?, ";
        values.push(department);
    }

    if (activity_name) {
        sql += "activity_name = ?, ";
        values.push(activity_name);
    }

    if (activity_date) {

        const parsedDate = new Date(activity_date);

        if (isNaN(parsedDate)) {

            db.end();

            return res.status(400).json({
                message: "Invalid activity_date"
            });
        }

        sql += "activity_date = ?, ";
        values.push(activity_date);
    }

    if (remark) {
        sql += "remark = ?, ";
        values.push(remark);
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

    db.query(sql, values, (err, result) => {

        db.end();

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Activity not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Activity updated successfully"
        });
    });
};


/* ================= DELETE ACTIVITY ================= */
export const deleteActivity = (req, res) => {

    const db = getDB(req);

    const { id } = req.params;

    db.query(
        "DELETE FROM activity WHERE id = ?",
        [id],
        (err, result) => {

            db.end();

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Activity not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Activity deleted successfully"
            });
        }
    );
};