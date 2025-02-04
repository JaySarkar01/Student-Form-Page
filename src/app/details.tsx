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
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });

  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 5; // Number of students per page

  // Get unique course options
  const courseOptions = useMemo(() => {
    return Array.from(new Set(students.map((student) => student.course)));
  }, [students]);

  // Sort and Filter Logic
  const sortedAndFilteredStudents = useMemo(() => {
    let filtered = students.filter(
      (student) =>
        (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.age.toString().includes(searchQuery)) &&
        (selectedCourse ? student.course === selectedCourse : true)
    );

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) =>
        String(a[sortConfig.key])
          .localeCompare(String(b[sortConfig.key]), undefined, { sensitivity: "base" }) *
        (sortConfig.direction === "asc" ? 1 : -1)
      );
    }

    return filtered;
  }, [students, searchQuery, selectedCourse, sortConfig]);

  // Calculate Pagination
  const totalPages = Math.ceil(sortedAndFilteredStudents.length / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedStudents = sortedAndFilteredStudents.slice(startIndex, endIndex);

  // Handle Sorting
  const handleSort = (key: keyof Student) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle Search
  const handleSearch = () => {
    setSearchQuery(searchText);
    setPage(1); // Reset to first page when searching
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      <div className="flex justify-between items-center mb-4">
        {/* Course Filter */}
        <select
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            setPage(1); // Reset to first page when filtering
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Courses</option>
          {courseOptions.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>

        {/* Search Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search students..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Search
          </button>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchText("");
                setSearchQuery("");
                setPage(1); // Reset to first page when resetting
              }}
              className="px-4 py-2 bg-green-700 text-white rounded-lg"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Showing Records Count */}
      <div className="text-sm text-gray-600 mb-4">
        Showing {paginatedStudents.length} of {sortedAndFilteredStudents.length} students
      </div>

      {/* Students Table */}
      <div className="h-[500px] overflow-y-auto overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {["name", "email", "age", "course"].map((field) => (
                <th
                  key={field}
                  className="border p-2 cursor-pointer"
                  onClick={() => handleSort(field as keyof Student)}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                  {sortConfig.key === field && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
              ))}
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student) => (
                <tr key={student._id} className="text-center">
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">{student.email}</td>
                  <td className="border p-2">{student.age}</td>
                  <td className="border p-2">{student.course}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(student._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
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

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
