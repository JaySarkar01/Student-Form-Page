import { useState, useMemo } from "react";

interface Student {
  _id: string;
  name: string;
  email: string;
  age: number;
  course: string;
}

interface Props {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export default function ShowDetails({ students, onEdit, onDelete }: Props) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: "asc" | "desc" }>({ key: "name", direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");

  // Sort and Filter Logic Combined
  const sortedAndFilteredStudents = useMemo(() => {
    let filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.age.toString().includes(searchQuery)
    );

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        return String(a[sortConfig.key])
          .localeCompare(String(b[sortConfig.key]), undefined, { sensitivity: "base" }) 
          * (sortConfig.direction === "asc" ? 1 : -1);
      });
    }
    

    return filtered;
  }, [students, searchQuery, sortConfig]);

  const handleSort = (key: keyof Student) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Student Details</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search students"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Reset
            </button>
          ) : null}
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        Showing {sortedAndFilteredStudents.length} of {students.length} records
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {["name", "email", "age", "course"].map((field) => (
              <th
                key={field}
                className="border p-2 cursor-pointer"
                onClick={() => handleSort(field as keyof Student)}
                aria-label={`Sort by ${field}`}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                {sortConfig.key === field && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
            ))}
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedAndFilteredStudents.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No students found
              </td>
            </tr>
          ) : (
            sortedAndFilteredStudents.map((student) => (
              <tr key={student._id} className="text-center">
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.email}</td>
                <td className="border p-2">{student.age}</td>
                <td className="border p-2">{student.course}</td>
                <td className="border p-2">
                  <button
                    onClick={() => onEdit(student)}
                    className="bg-blue-500 text-white px-3 py-1 mb-2 rounded-lg mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(student._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
