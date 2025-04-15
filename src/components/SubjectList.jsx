import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "https://attendipen-d65abecaffe3.herokuapp.com";

const SubjectList = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      console.log("Fetching subjects...");
      console.log("Using token:", token);

      const response = await axios.get(
        `${BASE_URL}/subjects/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("API Response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setSubjects(response.data);
      } else {
        console.error("Invalid data format received:", response.data);
        setError("Invalid data format received from server");
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setError(error.response?.data?.message || "Failed to fetch subjects");
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to fetch subjects",
        icon: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [navigate]);

  const handleDelete = async (subjectId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate("/login");
          return;
        }

        await axios.delete(
          `${BASE_URL}/subjects/${subjectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setSubjects(subjects.filter((subject) => subject.id !== subjectId));
        Swal.fire("Deleted!", "Subject has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to delete subject",
        icon: "error",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <header>
        <h1>Subjects</h1>
        <button onClick={() => navigate("/CreateSubject")}>
          Add New Subject
        </button>
      </header>

      <div>
        {subjects.length === 0 ? (
          <div>
            <p>No subjects found</p>
            <button onClick={() => navigate("/CreateSubject")}>
              Create New Subject
            </button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject.subject_id}>
                  <td className="px-6 py-4 whitespace-nowrap">{subject.subject_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{subject.class_name || 'Not assigned'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-500">ID: {subject.subject_id}</span>
                    {subject.subject_class_id && (
                      <span className="ml-2 text-gray-500">Class ID: {subject.subject_class_id}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => navigate(`/subjects/assign/${subject.subject_id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Assign to Class
                    </button>
                    <button
                      onClick={() => handleDelete(subject.subject_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SubjectList;
