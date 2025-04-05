import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import "../assets/style/addteacher.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Profile = () => {
  const navigate = useNavigate();

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    gender: yup.string().oneOf(["male", "female", "other"], "Invalid gender").required("Gender is required"),
    phone_number: yup.string().required("Phone number is required"),
    address: yup.string().required("Address is required"),
    about: yup.string().required("About is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      gender: "",
      phone_number: "",
      address: "",
      about: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.put(
          "https://attendipen-d65abecaffe3.herokuapp.com/profile/edit",
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
            text: "Profile updated successfully",
            icon: "success",
          }).then(() => {
            navigate("/viewProfile");
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Failed to update profile",
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
            </div>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <div className="profile-container">
          <div className="profile-header">
            <h2>Update Profile</h2>
            <button 
              onClick={() => navigate("/viewProfile")} 
              className="view-profile-btn"
            >
              View Profile
            </button>
          </div>
          <form onSubmit={formik.handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                placeholder="Enter your name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="error">{formik.errors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.gender}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <div className="error">{formik.errors.gender}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone_number}
                placeholder="Enter your phone number"
              />
              {formik.touched.phone_number && formik.errors.phone_number && (
                <div className="error">{formik.errors.phone_number}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                placeholder="Enter your address"
              />
              {formik.touched.address && formik.errors.address && (
                <div className="error">{formik.errors.address}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="about">About</label>
              <textarea
                id="about"
                name="about"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.about}
                placeholder="Tell us about yourself"
              />
              {formik.touched.about && formik.errors.about && (
                <div className="error">{formik.errors.about}</div>
              )}
            </div>

            <button type="submit" className="submit-btn">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
