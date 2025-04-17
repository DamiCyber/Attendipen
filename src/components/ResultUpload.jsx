import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import "../assets/style/profile.css";

const ResultUpload = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://attendipen-d65abecaffe3.herokuapp.com";

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);

      // Fetch subjects
      const subjectsResponse = await axios.get(
        `${BASE_URL}/subjects/my_subjects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      // Transform the subjects data to include both subject and class information
      const transformedSubjects = subjectsResponse.data.map(subject => ({
        subject_class_id: subject.id,
        subject_name: subject.name,
        class_name: subject.class_name || 'Unassigned'
      }));
      
      setSubjects(transformedSubjects);

      // Fetch students
      const studentsResponse = await axios.get(
        `${BASE_URL}/students/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setStudents(studentsResponse.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch data",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const validationSchema = yup.object({
    subject_class_id: yup.number().required("Subject-Class combination is required"),
    student_id: yup.number().required("Student is required"),
    score: yup.number()
      .required("Score is required")
      .min(0, "Score must be at least 0")
      .max(100, "Score cannot exceed 100")
  });

  const formik = useFormik({
    initialValues: {
      subject_class_id: "",
      student_id: "",
      score: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.post(
          `${BASE_URL}/subjects/upload_result`,
          {
            subject_class_id: parseInt(values.subject_class_id),
            student_id: parseInt(values.student_id),
            score: parseInt(values.score)
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          Swal.fire({
            title: "Success",
            text: "Result uploaded successfully",
            icon: "success",
          });
          formik.resetForm();
        }

      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Failed to upload result",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex h-screen bg-[#F9F9F9]">
      {/* Sidebar */}
      <div className="w-64 bg-[#4D44B5] text-white sidebar">
        {/* ... Your existing sidebar code ... */}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 mt-7 main-content">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="description">
            <h1 className="text-2xl font-semibold text-[#4D44B5]">Upload Student Result</h1>
          </div>
        </header>

        <div className="main-content">
          <div className="content">
            <div className="student-details">
              <h2 className='m-white'>Upload Result</h2>
            </div>

            {/* Result Upload Form */}
            <form onSubmit={formik.handleSubmit} className="profile-form mb-8">
              <div className="form-group">
                <label htmlFor="subject_class_id">Select Subject-Class</label>
                <select
                  id="subject_class_id"
                  name="subject_class_id"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.subject_class_id}
                  disabled={loading}
                >
                  <option value="">Select a subject-class</option>
                  {subjects.map((subject) => (
                    <option key={subject.subject_class_id} value={subject.subject_class_id}>
                      {subject.subject_name} - {subject.class_name}
                    </option>
                  ))}
                </select>
                {formik.touched.subject_class_id && formik.errors.subject_class_id && (
                  <div className="error">{formik.errors.subject_class_id}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="student_id">Select Student</label>
                <select
                  id="student_id"
                  name="student_id"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.student_id}
                  disabled={loading}
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} (ID: {student.id})
                    </option>
                  ))}
                </select>
                {formik.touched.student_id && formik.errors.student_id && (
                  <div className="error">{formik.errors.student_id}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="score">Score (0-100)</label>
                <input
                  type="number"
                  id="score"
                  name="score"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.score}
                  disabled={loading}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formik.touched.score && formik.errors.score && (
                  <div className="error">{formik.errors.score}</div>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Processing..." : "Upload Result"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultUpload;
