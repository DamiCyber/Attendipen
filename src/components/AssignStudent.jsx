import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
// import "../assets/style/addteacher.css";

const AssignStudent = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const validationSchema = yup.object({
    class_id: yup.number().required("Class is required"),
    student_id: yup.number().required("Student is required"),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch classes
        const classesResponse = await axios.get(
          "https://attendipen-d65abecaffe3.herokuapp.com/classes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setClasses(classesResponse.data || []);

        // Fetch students
        const studentsResponse = await axios.get(
          "https://attendipen-d65abecaffe3.herokuapp.com/students/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setStudents(studentsResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch data. Please try again.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      class_id: "",
      student_id: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setAssigning(true);
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "https://attendipen-d65abecaffe3.herokuapp.com/classes/assign_student",
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
            text: "Student assigned to class successfully",
            icon: "success",
          }).then(() => {
            formik.resetForm();
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Failed to assign student to class",
          icon: "error",
        });
      } finally {
        setAssigning(false);
      }
    },
  });

  return (
    <div className="dashboard">
      <div className="sidebarUp">
        <nav>
          <ul>
            <div>
              <div className="side-logo">
                <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1734938938/amend_lntakp.png" alt="" />
                <h1>Attendipen</h1>
              </div>
              <div className="border-line"></div>
              <nav className="naval">
                <ul>
                  <div className="board">
                    <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/home-2_wwzqrg.png" alt="" />
                    <Link to="/Dashboard" className="link">Dashboard</Link>
                  </div>
                 
                </ul>
              </nav>
            </div>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <div className="form-container">
          <h2>Assign Student to Class</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label htmlFor="class_id">Select Class</label>
              <select
                id="class_id"
                name="class_id"
                onChange={formik.handleChange}
                value={formik.values.class_id}
                disabled={loading || assigning}
                className={loading || assigning ? 'loading' : ''}
              >
                <option value="">Select a class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              {formik.touched.class_id && formik.errors.class_id && (
                <div className="error">{formik.errors.class_id}</div>
              )}
              {loading && <div className="loading-text">Loading classes...</div>}
            </div>

            <div className="form-group">
              <label htmlFor="student_id">Select Student</label>
              <select
                id="student_id"
                name="student_id"
                onChange={formik.handleChange}
                value={formik.values.student_id}
                disabled={loading || assigning}
                className={loading || assigning ? 'loading' : ''}
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
              {loading && <div className="loading-text">Loading students...</div>}
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || assigning || !formik.values.class_id || !formik.values.student_id}
            >
              {assigning ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Assigning...
                </span>
              ) : (
                "Assign Student"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignStudent;