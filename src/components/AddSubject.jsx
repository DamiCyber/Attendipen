import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const BASE_URL = "https://attendipen-d65abecaffe3.herokuapp.com";

const AddSubject = () => {
  const navigate = useNavigate();

  const validationSchema = yup.object({
    name: yup.string().required("Subject name is required"),
    description: yup.string().required("Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate("/login");
          return;
        }

        console.log("Submitting subject data:", values);
        console.log("Using token:", token);

        const response = await axios.post(
          `${BASE_URL}/subjects`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response);
        console.log("Response Status:", response.status);
        console.log("Response Data:", response.data);

        if (response.status === 201) {
          console.log("Subject created successfully");
          Swal.fire({
            title: "Success",
            text: "Subject created successfully",
            icon: "success",
          }).then(() => {
            navigate("/SubjectList");
          });
        } else {
          console.warn("Unexpected response status:", response.status);
          throw new Error("Unexpected response from server");
        }
      } catch (error) {
        console.error("Error creating subject:", error);
        console.error("Error response:", error.response);
        
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "Failed to create subject";
        
        console.error("Error message:", errorMessage);
        
        Swal.fire({
          title: "Error",
          text: errorMessage,
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
            <h1 className="text-2xl font-semibold text-[#4D44B5]">Add Subject</h1>
          </div>
        </header>

        <div className="main-content">
          <div className="content">
            <div className="student-details">
              <h2 className='m-white'>Create New Subject</h2>
            </div>
            <form onSubmit={formik.handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Subject Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  placeholder="Enter subject name"
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="error">{formik.errors.name}</div>
                )}
              </div>

              <div className="form-group about">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                  placeholder="Enter subject description"
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="error">{formik.errors.description}</div>
                )}
              </div>

              <button type="submit" className="submit-btn">
                Create Subject
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubject;
