import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import "../assets/style/addteacher.css";

const Mark = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const validationSchema = yup.object({
    class_id: yup.number().required("Class is required"),
    student_id: yup.number().required("Student is required"),
    status: yup.string().required("Status is required"),
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "https://attendipen-d65abecaffe3.herokuapp.com/classes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setClasses(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching classes:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch classes",
          icon: "error",
        });
        setLoading(false);
      }
    };

    fetchClasses();
  }, [navigate]);

  const fetchStudents = async (classId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://attendipen-d65abecaffe3.herokuapp.com/classes/${classId}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setStudents(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch students",
        icon: "error",
      });
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      class_id: "",
      student_id: "",
      status: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            title: "Error",
            text: "Please login again",
            icon: "error",
          });
          navigate("/login");
          return;
        }

        // Format the data to match the expected API format
        const attendanceData = {
          class_id: parseInt(values.class_id),
          student_id: parseInt(values.student_id),
          status: values.status
        };

        console.log("Sending attendance data:", attendanceData); // Debug log

        const response = await axios.post(
          "https://attendipen-d65abecaffe3.herokuapp.com/attendance/mark",
          attendanceData,
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
            text: "Attendance marked successfully",
            icon: "success",
          }).then(() => {
            formik.resetForm();
            setStudents([]);
          });
        }
      } catch (error) {
        console.error("Error marking attendance:", error);
        console.error("Error response data:", error.response?.data); // Log the full error response
        
        let errorMessage = "Failed to mark attendance";
        
        if (error.response) {
          // Log the full error response for debugging
          console.log("Full error response:", {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
          });

          if (error.response.data?.error === 'Attendance closed for today') {
            errorMessage = "Attendance marking is closed for today. Please try again during the allowed time period.";
          } else if (error.response.status === 400) {
            // Show the specific error message from the server if available
            errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          "Invalid data format. Please check your input.";
          } else if (error.response.status === 403) {
            errorMessage = "You don't have permission to mark attendance. Please check your role.";
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        }

        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
        });
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
                    <Link to="/TeachersDashboard" className="link">Dashboard</Link>
                  </div>
                  <div className="board">
                    <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/home-2_wwzqrg.png" alt="" />
                    <Link to="/MarkAttendance" className="link">Attendance</Link>
                  </div>
                  <div className="board">
                    <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/teacher_mmxcpi.svg" alt="" />
                    <Link to="/accept" className="link">Accept invite</Link>
                  </div>
                </ul>
              </nav>
            </div>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <div className="form-container">
          <h2>Mark Attendance</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label htmlFor="class_id">Select Class</label>
              <select
                id="class_id"
                name="class_id"
                onChange={(e) => {
                  formik.handleChange(e);
                  fetchStudents(e.target.value);
                }}
                value={formik.values.class_id}
                disabled={loading}
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
            </div>

            <div className="form-group">
              <label htmlFor="student_id">Select Student</label>
              <select
                id="student_id"
                name="student_id"
                onChange={formik.handleChange}
                value={formik.values.student_id}
                disabled={!formik.values.class_id || loading}
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

            <div className="form-group">
              <label htmlFor="status">Attendance Status</label>
              <select
                id="status"
                name="status"
                onChange={formik.handleChange}
                value={formik.values.status}
                disabled={!formik.values.student_id}
              >
                <option value="">Select status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
              {formik.touched.status && formik.errors.status && (
                <div className="error">{formik.errors.status}</div>
              )}
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || !formik.values.class_id || !formik.values.student_id || !formik.values.status}
            >
              {loading ? "Loading..." : "Mark Attendance"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Mark;