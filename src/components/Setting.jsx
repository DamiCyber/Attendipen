import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const Setting = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

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

  const validationSchema = yup.object({
    start_time: yup.string().required("Start time is required"),
    end_time: yup.string().required("End time is required"),
  });

  const formik = useFormik({
    initialValues: {
      start_time: "",
      end_time: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          "https://attendipen-d65abecaffe3.herokuapp.com/settings/attendance_time",
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
            title: "Attendance settings updated successfully",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => navigate("/View"));
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
    <div className="setting-container">
      <div className="main-content">
        <header className="header">
          <div className="description">
            <h1>Attendance</h1>
          </div>

          <div className="control">
            <button className="control-btn">
              <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281722/bell_muudfk.svg" alt="notifications" />
            </button>
            <button className="control-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
                <path d="M12.2629 2.66669L11.4166 6.46617C10.9352 6.6978 10.4751 6.9646 10.0338 7.26565L6.32023 6.09637L2.58325 12.5703L5.39836 15.1485C5.28837 15.9648 5.33819 16.3672 5.39836 16.8516L2.58325 19.4297L6.32023 25.9037L10.0338 24.7344C10.4751 25.0354 10.9352 25.3022 11.4166 25.5339L12.2629 29.3334H19.7369L20.5833 25.5339C21.0646 25.3022 21.5248 25.0354 21.9661 24.7344L25.6796 25.9037L29.4166 19.4297L26.6015 16.8516C26.6245 16.5682 26.6663 16.2846 26.6666 16C26.6677 15.7069 26.6215 15.4108 26.6015 15.1485L29.4166 12.5703L25.6796 6.09637L21.9661 7.26565C21.5248 6.9646 21.0646 6.6978 20.5833 6.46617L19.7369 2.66669H12.2629ZM14.4036 5.33335H17.5963L18.2551 8.29169L18.9166 8.5521C19.6648 8.84513 20.3643 9.24847 20.9921 9.75002L21.5494 10.1927L24.44 9.28387L26.0364 12.0495L23.802 14.099L23.9088 14.8021C24.0344 15.5797 24.01 16.4746 23.9088 17.1979L23.802 17.9011L26.0364 19.9505L24.44 22.7162L21.5494 21.8073L20.9921 22.25C20.3643 22.7516 19.6648 23.1549 18.9166 23.4479L18.2551 23.7084L17.5963 26.6667H14.4036L13.7447 23.7084L13.0833 23.4479C12.335 23.1549 11.6356 22.7516 11.0077 22.25L10.4504 21.8073L7.55981 22.7162L5.96346 19.9505L8.19783 17.9011L8.09106 17.1979C7.96083 16.4047 7.98083 15.4967 8.09106 14.8021L8.19783 14.099L5.96346 12.0495L7.55981 9.28387L10.4504 10.1927L11.0077 9.75002C11.6356 9.24847 12.335 8.84513 13.0833 8.5521L13.7447 8.29169L14.4036 5.33335ZM15.9999 10.6667C13.0702 10.6667 10.6666 13.0703 10.6666 16C10.6666 18.9297 13.0702 21.3334 15.9999 21.3334C18.9296 21.3334 21.3333 18.9297 21.3333 16C21.3333 13.0703 18.9296 10.6667 15.9999 10.6667ZM15.9999 13.3334C17.4885 13.3334 18.6666 14.5115 18.6666 16C18.6666 17.4886 17.4885 18.6667 15.9999 18.6667C14.5114 18.6667 13.3333 17.4886 13.3333 16C13.3333 14.5115 14.5114 13.3334 15.9999 13.3334Z" fill="#A098AE" />
              </svg>
            </button>
            <div className="user-info">
              <div>
                <p>{user?.name || "Loading..."}</p>
                <p>Admin</p>
              </div>
              <img
                src={user?.profile_picture || "https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281722/bell_muudfk.svg"}
                alt="profile"
                className="profile-picture"
              />
              <Link to="/login" onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
              }}>
                Logout
              </Link>
            </div>
          </div>
        </header>

        <div className="content">
          <div className="student-details">
            <h1>Attendance Setting</h1>
          </div>
          <form onSubmit={formik.handleSubmit} className="setting-form">
            <div className="form-group">
              <input
                type="text"
                name="start_time"
                placeholder="Start Time (HH:MM)"
                value={formik.values.start_time}
                onChange={formik.handleChange}
                className="form-input"
              />
              {formik.errors.start_time && <p className="error-message">{formik.errors.start_time}</p>}
            </div>

            <div className="form-group">
              <input
                type="text"
                name="end_time"
                placeholder="End Time (HH:MM)"
                value={formik.values.end_time}
                onChange={formik.handleChange}
                className="form-input"
              />
              {formik.errors.end_time && <p className="error-message">{formik.errors.end_time}</p>}
            </div>

            <button type="submit" className="submit-btn">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setting;
