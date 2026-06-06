import masterDb from "../config/masterDb.js";

export const schoolMiddleware = (req, res, next) => {
    const schoolCode = req.headers["school-code"];

    if (!schoolCode) {
        return res.status(400).json({
            success: false,
            message: "School code is required"
        });
    }

    masterDb.query(
        "SELECT * FROM schools WHERE school_code = ?",
        [schoolCode],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid school code"
                });
            }

            req.school = result[0];
            req.databaseName = result[0].database_name;

            next();
        }
    );
};