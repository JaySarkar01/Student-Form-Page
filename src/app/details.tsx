interface Student {
  _id: string;
  name: string;
  email: string;
  age: number;
  course: string;
}

interface Props {
  students: Student[];
  onEdit: (student: Student) => void; // Function to handle edit
  onDelete: (id: string) => void; // Function to handle delete
}

export default function ShowDetails({ students, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      <h2 className="text-xl font-bold mb-4">Student Details</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No students found
              </td>
            </tr>
          ) : (
            students
              .slice()
              .reverse()
              .map((student) => (
                <tr key={student._id} className="text-center">
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">{student.email}</td>
                  <td className="border p-2">{student.age}</td>
                  <td className="border p-2">{student.course}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-blue-600"
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