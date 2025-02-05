import { useState, useMemo } from "react";
import ReactPaginate from "react-paginate";

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

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Number of students per page

  // Get unique course options from students
  const courseOptions = useMemo(() => {
    return Array.from(new Set(students.map((student) => student.course)));
  }, [students]);

  // Sort and Filter Logic Combined
  const sortedAndFilteredStudents = useMemo(() => {
    let filtered = students.filter(
      (student) =>
        (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.age.toString().includes(searchQuery)) &&
        (selectedCourse ? student.course === selectedCourse : true)
    );

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        return String(a[sortConfig.key])
          .localeCompare(String(b[sortConfig.key]), undefined, { sensitivity: "base" })
          * (sortConfig.direction === "asc" ? 1 : -1);
      });
    }

    return filtered;
  }, [students, searchQuery, selectedCourse, sortConfig]);

  // **Pagination Logic**
  const pageCount = Math.ceil(sortedAndFilteredStudents.length / itemsPerPage);
  const displayedStudents = sortedAndFilteredStudents.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  const handleSort = (key: keyof Student) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSearch = () => {
    setSearchQuery(searchText);
    setCurrentPage(0); // Reset to first page after searching
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Courses</option>
            {courseOptions.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search students..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchText("");
                setSearchQuery("");
                setCurrentPage(0);
              }}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Records Count */}
      <div className="text-sm text-gray-600 mb-4">
        Showing {displayedStudents.length} of {sortedAndFilteredStudents.length} records
      </div>

      {/* Table */}
      <div className="h-[400px] overflow-y-auto">
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
            {displayedStudents.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              displayedStudents.map((student) => (
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

      {/* Pagination Component */}
      <div className="mt-4 flex justify-center">
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={"pagination flex gap-2"}
          activeClassName={"bg-blue-500 text-white px-3 py-1 rounded-lg"}
          pageClassName={"px-3 py-1 border rounded-lg"}
          previousClassName={"px-3 py-1 border rounded-lg"}
          nextClassName={"px-3 py-1 border rounded-lg"}
        />
      </div>
    </div>
  );
}
