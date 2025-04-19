import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AssignSubjectToStudent = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unassignLoading, setUnassignLoading] = useState(false);

  const BASE_URL = "https://attendipen-d65abecaffe3.herokuapp.com";

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);

      // Fetch subjects with their class assignments
      const subjectsResponse = await axios.get(
        `${BASE_URL}/subjects/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubjects(subjectsResponse.data);

      // Fetch students
      const studentsResponse = await axios.get(
        `${BASE_URL}/students/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(studentsResponse.data);

    } catch (error) {
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
  });

  const formik = useFormik({
    initialValues: {
      subject_class_id: "",
      student_id: "",
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
          `${BASE_URL}/subjects/register_student`,
          {
            subject_class_id: parseInt(values.subject_class_id),
            student_id: parseInt(values.student_id)
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
            text: "Student registered to subject successfully",
            icon: "success",
          });
          formik.resetForm();
        }

      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Failed to register student to subject",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleUnassignStudent = async () => {
    try {
      setUnassignLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.delete(
        `${BASE_URL}/subjects/unassign_student`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            subject_class_id: parseInt(formik.values.subject_class_id),
            student_id: parseInt(formik.values.student_id)
          }
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Student unassigned from subject successfully",
          icon: "success",
        });
        formik.resetForm();
      }

    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to unassign student from subject",
        icon: "error",
      });
    } finally {
      setUnassignLoading(false);
    }
  };

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
            <h1 className="text-2xl font-semibold text-[#4D44B5]">Register Student to Subject</h1>
          </div>
        </header>

        <div className="main-content">
          <div className="content">
            <div className="student-details">
              <h2 className='m-white'>Register Student</h2>
            </div>

            {/* Registration Form */}
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
                      {subject.subject_name} - {subject.class_name || 'Unassigned'}
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
                      {student.name}
                    </option>
                  ))}
                </select>
                {formik.touched.student_id && formik.errors.student_id && (
                  <div className="error">{formik.errors.student_id}</div>
                )}
              </div>

              <div className="button-group">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Processing..." : "Register Student"}
                </button>
                <button 
                  type="button" 
                  className="unassign-btn" 
                  onClick={handleUnassignStudent}
                  disabled={unassignLoading || !formik.values.subject_class_id || !formik.values.student_id}
                >
                  {unassignLoading ? "Processing..." : "Unassign Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignSubjectToStudent;
