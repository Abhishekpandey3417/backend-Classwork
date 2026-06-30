import bcrypt from "bcrypt";
import masterDb from "../config/db.js";
import getSchoolDB from "../config/schoolDb.js";

export const signup = async (req, res) => {
    let schoolDb;

    try {
        const {
            schoolCode,
            full_name,
            username,
            email,
            phone,
            password,
            confirm_password
        } = req.body;

        // Validate required fields
        if (
            !schoolCode ||
            !full_name ||
            !username ||
            !email ||
            !phone ||
            !password ||
            !confirm_password
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate password
        if (password !== confirm_password) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // Find school in master database
        const [schools] = await masterDb.promise().query(
            "SELECT * FROM schools WHERE school_code = ?",
            [schoolCode]
        );

        if (schools.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Invalid school code"
            });
        }

        // Connect to school's database
        schoolDb = getSchoolDB(schools[0].database_name);

        // Check username
        const [existingUsers] = await schoolDb.promise().query(
            "SELECT user_id FROM users WHERE username = ?",
            [username]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        // Check email
        const [existingEmail] = await schoolDb.promise().query(
            "SELECT user_id FROM users WHERE email = ?",
            [email]
        );

        if (existingEmail.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await schoolDb.promise().query(
            `
            INSERT INTO users
            (
                schoolCode,
                full_name,
                username,
                email,
                phone,
                password_hash
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                schoolCode,
                full_name,
                username,
                email,
                phone,
                hashedPassword
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user_id: result.insertId
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {
        if (schoolDb) {
            schoolDb.end();
        }
    }
};