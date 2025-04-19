import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Link } from "react-router-dom";
import * as yup from 'yup';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from '../utils/userUtils';


const AddTeachers = () => {
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  const validationSchema = yup.object({
    email: yup.string().email("Invalid email format").required("Email is required").max(28).min(8),
    salary: yup.number()
      .typeError("Salary must be a number")
      .required("Salary is required"),
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      salary: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "https://attendipen-d65abecaffe3.herokuapp.com/invites/send_offer",
          values,
          {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          Swal.fire({
            title: "Invite sent successfully",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => navigate("/Teachers"));
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "An error occurred",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  return (  
  <div className="content">
  <div className="teacher-details">
    <h1>Send Teacher Invite</h1>
  </div>
  <form onSubmit={formik.handleSubmit} className='context'>
    <label htmlFor="email">Email</label>
    <input
      type="email"
      name="email"
      placeholder="Enter your email"
      value={formik.values.email}
      onChange={formik.handleChange}
    />
    <p>{formik.errors.email && <p className="error">{formik.errors.email}</p>}</p>

    <label htmlFor="email">Salary</label>
    <input
      type="number"
      name="salary"
      placeholder="Salary Amount"
      value={formik.values.salary}
      onChange={formik.handleChange}
    />
    {formik.errors.salary && <p className="error">{formik.errors.salary}</p>}

    <button type="submit">Send Invite</button>
  </form>
</div>

  );
};

export default AddTeachers;
