import connect from "../../src/app/dbs/db";
import User from "../../src/app/models/User";

export default async function handler(req, res) {
    await connect();

    try {
        if (req.method === "POST") {
            const { name, email, age, course } = req.body;
            if (!name || !email || !age || !course) {
                return res.status(400).json({ message: "All fields are required!" });
            }
            const existingStudent = await User.findOne({ email });
            if (existingStudent) {
                return res.status(400).json({ message: "Email already registered!" });
            }
            const newStudent = new User({ name, email, age, course });
            await newStudent.save();
            return res.status(201).json({ message: "Student registered successfully!" });
        }

        if (req.method === "DELETE") {
            const { id } = req.query;
            await User.findByIdAndDelete(id);
            return res.status(200).json({ message: "Student deleted successfully!" });
        }

        if (req.method === "PUT") {
            const { _id, name, email, age, course } = req.body;
            const updatedStudent = await User.findByIdAndUpdate(
                _id,
                { name, email, age, course },
                { new: true }
            );
            return res.status(200).json({ message: "Student updated successfully!", student: updatedStudent });
        }

        if (req.method === "GET") {
            const students = await User.find();
            return res.status(200).json(students);
        }

        return res.status(405).json({ message: "Method Not Allowed" });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
