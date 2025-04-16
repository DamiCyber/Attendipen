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
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/subjects/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.data && Array.isArray(response.data)) {
        setSubjects(response.data);
      } else {
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

        setSubjects(subjects.filter((subject) => subject.subject_id !== subjectId));
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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Subjects</h1>
        <button
          onClick={() => navigate("/CreateSubject")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Subject
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No subjects found</p>
          <button
            onClick={() => navigate("/CreateSubject")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create New Subject
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject.subject_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subject.subject_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {subject.subject_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subject.class_name || 'Not assigned'}
                    </div>
                    {subject.class_id && (
                      <div className="text-sm text-gray-500">
                        Class ID: {subject.class_id}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      subject.subject_class_id ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {subject.subject_class_id ? 'Assigned' : 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => navigate(`/assign-subject/${subject.subject_id}`)}
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
        </div>
      )}
    </div>
  );
};

export default SubjectList;
