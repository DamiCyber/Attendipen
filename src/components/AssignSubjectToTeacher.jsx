import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import "../assets/style/profile.css";

const AssignSubjectToTeacher = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
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

      // Fetch teachers
      const teachersResponse = await axios.get(
        `${BASE_URL}/teachers/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeachers(teachersResponse.data);

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
    id: yup.number().required("Teacher is required"),
  });

  const formik = useFormik({
    initialValues: {
      subject_class_id: "",
      id: "",
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

        // Get the selected teacher's data
        const selectedTeacher = teachers.find(t => t.id === parseInt(values.id));
        const selectedSubject = subjects.find(s => s.subject_class_id === parseInt(values.subject_class_id));

        const response = await axios.post(
          `${BASE_URL}/subjects/assign_teacher`,
          {
            subject_class_id: values.subject_class_id,
            teacher_id: selectedTeacher.id
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
            text: `Teacher ${selectedTeacher.name} assigned to ${selectedSubject.subject_name} successfully`,
            icon: "success",
          });
          fetchData(); // Refresh the data
        }

      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Failed to assign teacher to subject",
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
            <h1 className="text-2xl font-semibold text-[#4D44B5]">Assign Subject to Teacher</h1>
          </div>
        </header>

        <div className="main-content">
          <div className="content">
            <div className="student-details">
              <h2 className='m-white'>Assign Subject</h2>
            </div>

            {/* Assignment Form */}
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
                <label htmlFor="id">Select Teacher</label>
                <select
                  id="id"
                  name="id"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.id}
                  disabled={loading}
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                {formik.touched.id && formik.errors.id && (
                  <div className="error">{formik.errors.id}</div>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Processing..." : "Assign Teacher"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignSubjectToTeacher;
