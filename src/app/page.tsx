"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import ShowDetails from "./details";

interface Student {
  _id: string;
  name: string;
  email: string;
  age: number;
  course: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    _id: "", // For editing
    name: "",
    email: "",
    age: "",
    course: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    age: "",
    course: "",
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch students from the API
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/getStudents");
      const data: Student[] = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage({ type: "error", text: "Failed to fetch students." });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = { name: "", email: "", age: "", course: "" };
    let isValid = true;

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required!";
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required!";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address!";
      isValid = false;
    }

    // Validate age
    if (!formData.age.trim() || isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = "Valid age is required!";
      isValid = false;
    }

    // Validate course
    if (!formData.course.trim()) {
      newErrors.course = "Course is required!";
      isValid = false;
    }

    // Update errors state
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission (for both add and update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const url = formData._id ? `/api/students?id=${formData._id}` : "/api/students";
      const method = formData._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        setFormData({ _id: "", name: "", email: "", age: "", course: "" }); // Reset form
        fetchStudents(); // Refresh the list
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error when user types
  };

  // Handle edit button click
  const handleEdit = (student: Student) => {
    setFormData({
      _id: student._id,
      name: student.name,
      email: student.email,
      age: student.age.toString(),
      course: student.course,
    });
  };

  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/students?id=${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (response.ok) {
          setMessage({ type: "success", text: data.message });
          fetchStudents(); // Refresh the list
        } else {
          setMessage({ type: "error", text: data.message });
        }
      } catch (error) {
        setMessage({ type: "error", text: "Failed to delete student." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Student Management System
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {formData._id ? "Edit Student" : "Student Registration Form"}
            </h2>
            {message && (
              <div
                className={`p-4 mb-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.age ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter age"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Course
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.course ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="" disabled>
                    Select a course
                  </option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="BCA">BCA</option>
                  <option value="BA English">BA English</option>
                  {/* <option value="Chemistry">BA english</option> */}
                </select>
                {errors.course && (
                  <p className="text-red-500 text-sm mt-1">{errors.course}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>

          {/* Table Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Student Details
            </h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-32 ">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <ShowDetails
                students={students}
                onEdit={handleEdit}
                onDelete={handleDelete}
                
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}