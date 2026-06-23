import jwt from "jsonwebtoken";
import masterDb from "../config/db.js";

export const login = async (req, res) => {
    try {
        const { school_code } = req.body;

        const [schools] = await masterDb.promise().query(
            "SELECT * FROM schools WHERE school_code = ?",
            [school_code]
        );

        if (schools.length === 0) {
            return res.status(404).json({
                message: "School not found"
            });
        }

        const school = schools[0];

        const token = jwt.sign(
            {
                school_code: school.school_code,
                database_name: school.database_name
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            message: "Login successful",
            token,
            school_code: school.school_code,
            database_name: school.database_name
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: err.message
        });
    }
};