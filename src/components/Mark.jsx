import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = "https://attendipen-d65abecaffe3.herokuapp.com";

const Mark = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object({
    class_id: yup.number().required("Class is required"),
    student_id: yup.number().required("Student is required"),
    status: yup.string().oneOf(['present', 'absent'], "Please select a valid status").required("Status is required"),
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
          `${BASE_URL}/classes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (response.data && Array.isArray(response.data)) {
          setClasses(response.data);
        } else {
          throw new Error("Invalid classes data received");
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Failed to fetch classes. Please try again.",
          icon: "error",
        });
      } finally {
        setIsLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [navigate]);

  const fetchStudents = async (classId) => {
    if (!classId) return;
    
    setIsLoadingStudents(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/classes/${classId}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        throw new Error("Invalid students data received");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to fetch students. Please try again.",
        icon: "error",
      });
      setStudents([]);
    } finally {
      setIsLoadingStudents(false);
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
        setIsSubmitting(true);
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            title: "Session Expired",
            text: "Please login again to continue",
            icon: "warning",
          });
          navigate("/login");
          return;
        }

        const attendanceData = {
          class_id: parseInt(values.class_id),
          student_id: parseInt(values.student_id),
          status: values.status
        };

        const response = await axios.post(
          `${BASE_URL}/attendance/mark`,
          attendanceData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status >= 200 && response.status < 300) {
          await Swal.fire({
            title: "Success",
            text: "Attendance marked successfully",
            icon: "success",
          });
          formik.resetForm();
          setStudents([]);
        }
      } catch (error) {
        console.error("Error marking attendance:", error);
        
        let errorMessage = "Failed to mark attendance";
        
        if (error.response?.data?.error === 'Attendance closed for today') {
          errorMessage = "Attendance marking is closed for today. Please try again during the allowed time period.";
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.message || 
                        error.response.data?.error || 
                        "Invalid data format. Please check your input.";
        } else if (error.response?.status === 403) {
          errorMessage = "You don't have permission to mark attendance.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
        });
      } finally {
        setIsSubmitting(false);
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
                <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1734938938/amend_lntakp.png" alt="Logo" />
                <h1>Attendipen</h1>
              </div>
              <div className="border-line"></div>
              <nav className="naval">
                <ul>
                  <div className="board">
                    <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/home-2_wwzqrg.png" alt="Dashboard" />
                    <Link to="/TeachersDashboard" className="link">Dashboard</Link>
                  </div>
                  <div className="board">
                    <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/home-2_wwzqrg.png" alt="Attendance" />
                    <Link to="/MarkAttendance" className="link">Attendance</Link>
                  </div>
                  <div className="board">
                    <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/teacher_mmxcpi.svg" alt="Accept" />
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
          {isLoadingClasses ? (
            <div className="loading">Loading classes...</div>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <label htmlFor="class_id">Select Class</label>
                <select
                  id="class_id"
                  name="class_id"
                  onChange={(e) => {
                    formik.handleChange(e);
                    if (e.target.value) {
                      fetchStudents(e.target.value);
                      formik.setFieldValue('student_id', '');
                      formik.setFieldValue('status', '');
                    }
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.class_id}
                  disabled={isSubmitting}
                  className={formik.touched.class_id && formik.errors.class_id ? 'error' : ''}
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {formik.touched.class_id && formik.errors.class_id && (
                  <div className="error-message">{formik.errors.class_id}</div>
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
                  disabled={!formik.values.class_id || isLoadingStudents || isSubmitting}
                  className={formik.touched.student_id && formik.errors.student_id ? 'error' : ''}
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
                {formik.touched.student_id && formik.errors.student_id && (
                  <div className="error-message">{formik.errors.student_id}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="status">Attendance Status</label>
                <select
                  id="status"
                  name="status"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.status}
                  disabled={!formik.values.student_id || isSubmitting}
                  className={formik.touched.status && formik.errors.status ? 'error' : ''}
                >
                  <option value="">Select status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
                {formik.touched.status && formik.errors.status && (
                  <div className="error-message">{formik.errors.status}</div>
                )}
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting || !formik.isValid || !formik.dirty}
              >
                {isSubmitting ? "Marking..." : "Mark Attendance"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mark;