import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import masterDb from "../config/db.js";
import getSchoolDB from "../config/schoolDb.js";



export const login = async (req, res) => {
    try {

        const {
            school_code,
            username,
            password
        } = req.body;

        const headerSchoolCode =
            req.headers["school-code"];

        // Validate header
        if (!headerSchoolCode) {
            return res.status(400).json({
                message: "school-code header is required"
            });
        }

        // Validate request body
        if (!school_code || !username || !password) {
            return res.status(400).json({
                message:
                    "School code, username and password are required"
            });
        }

        // Match header and body school code
        if (headerSchoolCode !== school_code) {
            return res.status(400).json({
                message:
                    "Invalid school code. Header and body school code must match"
            });
        }

        // Find school from master database
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

        // Connect to school database
        const schoolDb = getSchoolDB(
            school.database_name
        );

        // Find user
        const [users] = await schoolDb.promise().query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (users.length === 0) {

            schoolDb.end();

            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const user = users[0];

        // Verify password
        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isMatch) {

            schoolDb.end();

            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                school_code: school.school_code,
                database_name: school.database_name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        schoolDb.end();

        return res.status(200).json({
            message: "Login successful",
            token,
            user_id: user.user_id,
            username: user.username,
            school_code: school.school_code,
            database_name: school.database_name
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: err.message
        });
    }
};