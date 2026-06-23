import masterDb from "../config/db.js";

export const schoolMiddleware = (req, res, next) => {

    console.log("\n========================");
    console.log("SCHOOL MIDDLEWARE");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);

    const schoolCode = req.headers["school-code"];

    console.log("School Code:", schoolCode);

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

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid school code"
                });
            }

            console.log("Database:", result[0].database_name);

            req.school = result[0];
            req.databaseName = result[0].database_name;

            next();
        }
    );
};

export default schoolMiddleware;