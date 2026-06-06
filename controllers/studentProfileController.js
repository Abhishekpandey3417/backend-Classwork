import db from "../config/db.js";


/* ================= CREATE STUDENT PROFILE ================= */
export const createStudentProfile = (req, res) => {

    const {
        admission_no,
        student_name,
        class: className,
        section,
        roll_number,
        gender,
        date_of_birth,
        blood_group,
        father_name,
        mother_name,
        parent_mobile,
        email,
        address,
        city,
        state,
        pincode,
        aadhaar_number,
        admission_date,
        status
    } = req.body;

    const student_photo = req.file ? req.file.filename : null;

    if (
        !admission_no ||
        !student_name ||
        !className ||
        !section
    ) {
        return res.status(400).json({
            message: "Required fields missing"
        });
    }

    const sql = `
        INSERT INTO student_profiles
        (
            admission_no,
            student_name,
            class,
            section,
            roll_number,
            gender,
            date_of_birth,
            blood_group,
            father_name,
            mother_name,
            parent_mobile,
            email,
            address,
            city,
            state,
            pincode,
            student_photo,
            aadhaar_number,
            admission_date,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            admission_no,
            student_name,
            className,
            section,
            roll_number,
            gender,
            date_of_birth,
            blood_group,
            father_name,
            mother_name,
            parent_mobile,
            email,
            address,
            city,
            state,
            pincode,
            student_photo,
            aadhaar_number,
            admission_date,
            status || "Active"
        ],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.status(201).json({
                message: "Student profile created successfully",
                id: result.insertId,
                photo: student_photo
            });

        }
    );
};



/* ================= GET STUDENT PROFILE ================= */
export const getStudentProfiles = (req, res) => {

    const {
        id,
        class: className,
        section,
        roll_number,
        admission_no
    } = req.query;

    let sql = "SELECT * FROM student_profiles WHERE 1=1";
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

    if (roll_number) {
        sql += " AND roll_number = ?";
        values.push(roll_number);
    }

    if (admission_no) {
        sql += " AND admission_no = ?";
        values.push(admission_no);
    }

    db.query(sql, values, (err, result) => {

        if (err) return res.status(500).json(err);

        const updatedResult = result.map(item => ({
            ...item,
            photo_url: item.student_photo
                ? `${req.protocol}://${req.get("host")}/uploads/${item.student_photo}`
                : null
        }));

        res.status(200).json(updatedResult);

    });
};

export const updateStudentProfile = (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Student profile ID is required"
        });
    }

    const {
        admission_no,
        student_name,
        class: className,
        section,
        roll_number,
        gender,
        date_of_birth,
        blood_group,
        father_name,
        mother_name,
        parent_mobile,
        email,
        address,
        city,
        state,
        pincode,
        aadhaar_number,
        admission_date,
        status
    } = req.body;

    const student_photo = req.file ? req.file.filename : null;

    let sql = "UPDATE student_profiles SET ";
    let values = [];

    if (admission_no) {
        sql += "admission_no=?, ";
        values.push(admission_no);
    }

    if (student_name) {
        sql += "student_name=?, ";
        values.push(student_name);
    }

    if (className) {
        sql += "`class`=?, ";
        values.push(className);
    }

    if (section) {
        sql += "section=?, ";
        values.push(section);
    }

    if (roll_number) {
        sql += "roll_number=?, ";
        values.push(roll_number);
    }

    if (gender) {
        sql += "gender=?, ";
        values.push(gender);
    }

    if (date_of_birth) {
        sql += "date_of_birth=?, ";
        values.push(date_of_birth);
    }

    if (blood_group) {
        sql += "blood_group=?, ";
        values.push(blood_group);
    }

    if (father_name) {
        sql += "father_name=?, ";
        values.push(father_name);
    }

    if (mother_name) {
        sql += "mother_name=?, ";
        values.push(mother_name);
    }

    if (parent_mobile) {
        sql += "parent_mobile=?, ";
        values.push(parent_mobile);
    }

    if (email) {
        sql += "email=?, ";
        values.push(email);
    }

    if (address) {
        sql += "address=?, ";
        values.push(address);
    }

    if (city) {
        sql += "city=?, ";
        values.push(city);
    }

    if (state) {
        sql += "state=?, ";
        values.push(state);
    }

    if (pincode) {
        sql += "pincode=?, ";
        values.push(pincode);
    }

    if (aadhaar_number) {
        sql += "aadhaar_number=?, ";
        values.push(aadhaar_number);
    }

    if (admission_date) {
        sql += "admission_date=?, ";
        values.push(admission_date);
    }

    if (status) {
        sql += "status=?, ";
        values.push(status);
    }

    if (student_photo) {
        sql += "student_photo=?, ";
        values.push(student_photo);
    }

    if (values.length === 0) {
        return res.status(400).json({
            message: "No fields provided for update"
        });
    }

    // remove last comma
    sql = sql.slice(0, -2);

    sql += " WHERE id=?";
    values.push(id);

    db.query(sql, values, (err, result) => {

        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        res.status(200).json({
            message: "Student profile updated successfully"
        });

    });
};



/* ================= DELETE STUDENT PROFILE ================= */
export const deleteStudentProfile = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM student_profiles WHERE id=?",
        [id],
        (err, result) => {

            if (err) return res.status(500).json(err);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Student profile not found"
                });
            }

            res.status(200).json({
                message: "Student profile deleted successfully"
            });

        }
    );
};