import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "https://attendipen-d65abecaffe3.herokuapp.com";

const AssignSubjectToClass = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unassignLoading, setUnassignLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const validationSchema = yup.object({
    subject_id: yup.number().required("Subject is required"),
    class_id: yup.number().required("Class is required"),
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Fetch subjects
      const subjectsResponse = await axios.get(
        `${BASE_URL}/subjects/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubjects(subjectsResponse.data);

      // Fetch classes
      const classesResponse = await axios.get(
        `${BASE_URL}/classes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClasses(classesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to fetch data. Please try again later.",
        icon: "error",
      });
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUnassignSubject = async () => {
    if (!formik.values.subject_id || !formik.values.class_id) {
      Swal.fire({
        title: "Error",
        text: "Please select both subject and class",
        icon: "error",
      });
      return;
    }

    try {
      setUnassignLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.delete(
        `${BASE_URL}/subjects/unassign_from_class`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            subject_id: parseInt(formik.values.subject_id),
            class_id: parseInt(formik.values.class_id)
          }
        }
      );

      if (response.status >= 200 && response.status < 300) {
        Swal.fire({
          title: "Success",
          text: "Subject unassigned from class successfully",
          icon: "success",
        });
        formik.resetForm();
      }
    } catch (error) {
      console.error("Error unassigning subject:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to unassign subject from class",
        icon: "error",
      });
    } finally {
      setUnassignLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      subject_id: "",
      class_id: "",
      subject_name: "",
      class_name: "",
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

        const requestData = {
          subject_id: parseInt(values.subject_id),
          class_id: parseInt(values.class_id)
        };

        const response = await axios.post(
          `${BASE_URL}/subjects/assign_to_class`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status >= 200 && response.status < 300) {
          Swal.fire({
            title: "Success",
            text: `Subject "${values.subject_name}" assigned to class "${values.class_name}" successfully`,
            icon: "success",
          });
          formik.resetForm();
        }
      } catch (error) {
        console.error("Error assigning subject:", error);
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Failed to assign subject to class",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleSubjectChange = (e) => {
    const selectedSubject = subjects.find(subject => subject.subject_id === parseInt(e.target.value));
    formik.setFieldValue('subject_id', e.target.value);
    formik.setFieldValue('subject_name', selectedSubject ? selectedSubject.subject_name : '');
  };

  const handleClassChange = (e) => {
    const selectedClass = classes.find(cls => cls.id === parseInt(e.target.value));
    formik.setFieldValue('class_id', e.target.value);
    formik.setFieldValue('class_name', selectedClass ? selectedClass.name : '');
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-[#4D44B5]">Loading...</div>
      </div>
    );
  }

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
                  onChange={handleSubjectChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.subject_id}
                  className={formik.touched.subject_id && formik.errors.subject_id ? 'error' : ''}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.subject_id} value={subject.subject_id}>
                      {subject.subject_name}
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
                  onChange={handleClassChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.class_id}
                  className={formik.touched.class_id && formik.errors.class_id ? 'error' : ''}
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

              <div className="button-group">
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={loading || !formik.values.subject_id || !formik.values.class_id}
                >
                  {loading ? "Processing..." : "Assign Subject"}
                </button>
                <button 
                  type="button" 
                  className="unassign-btn" 
                  onClick={handleUnassignSubject}
                  disabled={unassignLoading || !formik.values.subject_id || !formik.values.class_id}
                >
                  {unassignLoading ? "Processing..." : "Unassign Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignSubjectToClass;