import connect from "../../src/app/dbs/db";
import User from "../../src/app/models/User";

export default async function handler(req, res) {
  await connect();

  if (req.method === "GET") {
    try {
      const students = await User.find({}); // Fetch all students
      return res.status(200).json(students);
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}