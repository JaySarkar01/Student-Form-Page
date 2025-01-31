import connect from "../../src/app/dbs/db";
import User from "../../src/app/models/User";

export default async function handler(req, res) {
    // Connect to MongoDB
    await connect();
  
    if (req.method === "POST") {
      try {
        const { name, email, age, course } = req.body;
  
        // Validate input
        if (!name || !email || !age || !course) {
          return res.status(400).json({ message: "All fields are required!" });
        }
  
        // Check if email already exists
        const existingStudent = await User.findOne({ email });
        if (existingStudent) {
          return res.status(400).json({ message: "Email already registered!" });
        }
  
        // Create new student record
        const newStudent = new User({ name, email, age, course });
        await newStudent.save();
  
        return res.status(201).json({ message: "Student registered successfully!" });
      } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
      }
    }
  
    // Handle other HTTP methods (e.g., GET)
    res.status(405).json({ message: 'Method Not Allowed' });
  }