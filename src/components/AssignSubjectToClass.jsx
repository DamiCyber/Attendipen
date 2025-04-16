import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import "../assets/style/profile.css";

const AssignSubjectToClass = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch subjects
        const subjectsResponse = await axios.get(
          "https://attendipen-d65abecaffe3.herokuapp.com/subjects/list",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubjects(subjectsResponse.data);

        // Fetch classes
        const classesResponse = await axios.get(
          "https://attendipen-d65abecaffe3.herokuapp.com/classes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClasses(classesResponse.data);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to fetch data",
          icon: "error",
        });
      }
    };

    fetchData();
  }, [navigate]);

  const validationSchema = yup.object({
    subject_id: yup.number().required("Subject is required"),
    class_id: yup.number().required("Class is required"),
  });

  const formik = useFormik({
    initialValues: {
      subject_id: "",
      class_id: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.post(
          "https://attendipen-d65abecaffe3.herokuapp.com/subjects/assign_to_class",
          values,
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
            text: "Subject assigned to class successfully",
            icon: "success",
          }).then(() => {
            navigate("/SubjectList");
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Failed to assign subject to class",
          icon: "error",
        });
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
            <h1 className="text-2xl font-semibold text-[#4D44B5]">Assign Subject to Class</h1>
          </div>
        </header>

        <div className="main-content">
          <div className="content">
            <div className="student-details">
              <h2 className='m-white'>Assign Subject</h2>
            </div>
            <form onSubmit={formik.handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="subject_id">Select Subject</label>
                <select
                  id="subject_id"
                  name="subject_id"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.subject_id}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.subject_id} value={subject.subject_id}>
                      {subject.subject_name} (ID: {subject.subject_id})
                    </option>
                  ))}
                </select>
                {formik.touched.subject_id && formik.errors.subject_id && (
                  <div className="error">{formik.errors.subject_id}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="class_id">Select Class</label>
                <select
                  id="class_id"
                  name="class_id"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.class_id}
                >
                  <option value="">Select a class</option>
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
                {formik.touched.class_id && formik.errors.class_id && (
                  <div className="error">{formik.errors.class_id}</div>
                )}
              </div>

              <button type="submit" className="submit-btn">
                Assign Subject
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignSubjectToClass;
