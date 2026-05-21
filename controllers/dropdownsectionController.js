import db from "../db.js";


/* ================= CREATE ================= */
export const createDropdownSection = (req, res) => {

    const {
        menu_name,
        sub_title,
        details,
        icon_name,
        route_path,
        menu_type,
        status
    } = req.body;

    const sql = `
        INSERT INTO dropdown_sections
        (
            menu_name,
            sub_title,
            details,
            icon_name,
            route_path,
            menu_type,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            menu_name,
            sub_title,
            details,
            icon_name,
            route_path,
            menu_type,
            status || "Active"
        ],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.status(201).json({
                message: "Dropdown section created successfully",
                id: result.insertId
            });

        }
    );
};



/* ================= GET ================= */
export const getDropdownSections = (req, res) => {

    const {
        id,
        menu_name,
        menu_type,
        status
    } = req.query;

    let sql = "SELECT * FROM dropdown_sections WHERE 1=1";
    let values = [];

    if (id) {
        sql += " AND id=?";
        values.push(id);
    }

    if (menu_name) {
        sql += " AND menu_name LIKE ?";
        values.push(`%${menu_name}%`);
    }

    if (menu_type) {
        sql += " AND menu_type=?";
        values.push(menu_type);
    }

    if (status) {
        sql += " AND status=?";
        values.push(status);
    }

    db.query(sql, values, (err, result) => {

        if (err) return res.status(500).json(err);

        res.status(200).json(result);

    });
};



/* ================= UPDATE ================= */
export const updateDropdownSection = (req, res) => {

    const { id } = req.params;

    const {
        menu_name,
        sub_title,
        details,
        icon_name,
        route_path,
        menu_type,
        status
    } = req.body;

    let sql = "UPDATE dropdown_sections SET ";
    let values = [];

    if (menu_name) {
        sql += "menu_name=?, ";
        values.push(menu_name);
    }

    if (sub_title) {
        sql += "sub_title=?, ";
        values.push(sub_title);
    }

    if (details) {
        sql += "details=?, ";
        values.push(details);
    }

    if (icon_name) {
        sql += "icon_name=?, ";
        values.push(icon_name);
    }

    if (route_path) {
        sql += "route_path=?, ";
        values.push(route_path);
    }

    if (menu_type) {
        sql += "menu_type=?, ";
        values.push(menu_type);
    }

    if (status) {
        sql += "status=?, ";
        values.push(status);
    }

    if (values.length === 0) {
        return res.status(400).json({
            message: "No fields provided"
        });
    }

    sql = sql.slice(0, -2);

    sql += " WHERE id=?";
    values.push(id);

    db.query(sql, values, (err, result) => {

        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Dropdown section not found"
            });
        }

        res.status(200).json({
            message: "Dropdown section updated successfully"
        });

    });
};



/* ================= DELETE ================= */
export const deleteDropdownSection = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM dropdown_sections WHERE id=?",
        [id],
        (err, result) => {

            if (err) return res.status(500).json(err);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Dropdown section not found"
                });
            }

            res.status(200).json({
                message: "Dropdown section deleted successfully"
            });

        }
    );
};