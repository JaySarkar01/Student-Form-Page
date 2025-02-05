import { useState, useMemo } from "react";
import ReactPaginate from "react-paginate";

// Define the structure of a Student object
interface Student {
  _id: string;
  name: string;
  email: string;
  age: number;
  course: string;
}

// Define the expected props for the ShowDetails component
interface Props {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export default function ShowDetails({ students, onEdit, onDelete }: Props) {
  // State for sorting configuration
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student;
    direction: "asc" | "desc";
  }>({
    key: "name",
    direction: "asc",
  });

  // State for search and filtering
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [appliedCourse, setAppliedCourse] = useState("");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  // Get unique course options from students list
  const courseOptions = useMemo(() => {
    return Array.from(new Set(students.map((student) => student.course)));
  }, [students]);

  // Apply filtering and sorting logic
  const sortedAndFilteredStudents = useMemo(() => {
    let filtered = students.filter(
      (student) =>
        (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.age.toString().includes(searchQuery)) &&
        (appliedCourse ? student.course === appliedCourse : true)
    );

    // Sort students based on selected criteria
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        return (
          String(a[sortConfig.key]).localeCompare(
            String(b[sortConfig.key]),
            undefined,
            { sensitivity: "base" }
          ) * (sortConfig.direction === "asc" ? 1 : -1)
        );
      });
    }

    return filtered;
  }, [students, searchQuery, appliedCourse, sortConfig]);

  // Pagination calculations
  const pageCount = Math.ceil(sortedAndFilteredStudents.length / itemsPerPage);
  const displayedStudents = sortedAndFilteredStudents.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Handle pagination click event
  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  // Handle sorting on column click
  const handleSort = (key: keyof Student) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle search and filtering
  const handleSearch = () => {
    setSearchQuery(searchText);
    setAppliedCourse(selectedCourse);
    setCurrentPage(0);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      {/* Search and filter section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
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
            className="px-4 py-2 border border-gray-300 rounded-lg"
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
                setAppliedCourse("");
                setCurrentPage(0);
              }}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Display record count */}
      <div className="text-sm text-gray-600 mb-4">
        Showing {displayedStudents.length} of {sortedAndFilteredStudents.length}{" "}
        records
      </div>

      {/* Student table */}
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
                  {sortConfig.key === field &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
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

      {/* Pagination controls */}
      <div className="mt-4 flex justify-end">
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          marginPagesDisplayed={1}
  pageRangeDisplayed={2}
          containerClassName={"pagination flex gap-2"}
          activeClassName={"bg-blue-500 text-white px-3 py-1 rounded-lg"}
        />
      </div>
    </div>
  );
}
