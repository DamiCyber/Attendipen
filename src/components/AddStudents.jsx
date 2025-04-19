import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import axios from "axios";


const AddStudents = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Retrieve the user from localStorage
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

  useEffect(() => {
    const fetchClasses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          "https://attendipen-d65abecaffe3.herokuapp.com/classes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [navigate]);

  // Validation schema
  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required")
      .max(28, "Email must be at most 28 characters")
      .min(8, "Email must be at least 8 characters"),
    student_name: yup
      .string()
      .required("Full Name is required")
      .min(3, "Full Name must be at least 3 characters"),
    student_dob: yup
      .string()
      .required("DOB is required"),
    class_id: yup
      .string()
      .required("Class is required"),
    gender: yup.string().oneOf(["Male", "Female", "Other"], "Invalid gender").required("Gender is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      student_name: "",
      student_dob: "",
      gender: "",
      class_id: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          title: "Authentication Error",
          text: "Please log in to continue.",
          icon: "error",
          confirmButtonText: "OK",
        });
        navigate("/login");
        return;
      }

      try {
        const response = await axios.post(
          "https://attendipen-d65abecaffe3.herokuapp.com/invites/send_invite",
          values,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          Swal.fire({
            title: "Addmission sent successfully",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {

          });
        }
      } catch (error) {
        let errorMessage = "An error occurred. Please try again.";

        if (error.response) {
          errorMessage = error.response.data?.message || errorMessage;

          if (error.response.status === 401) {
            errorMessage = "Your session has expired. Please log in again.";
            localStorage.removeItem("token");
            navigate("/login");
          }
        }

        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  return (
    <div className="flex h-screen bg-[#F9F9F9]">
      {/* Sidebar */}
      <div className="w-64 bg-[#4D44B5] text-white sidebar">
        <div className="p-6 pb-4">
          <div className="flex flex-col items-center gap-4 mb-8">
            <img
              src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1734938938/amend_lntakp.png"
              alt="logo"
              className="w-30 h-30 object-contain"
            />
            <h1 className="text-xl font-semibold tracking-tight">Attendipen</h1>
          </div>
          <div className="border" />

          <nav className="flex-1">
            <ul className="space-y-4">
              {/* Dashboard Link */}
              <li>
                <Link
                  to="/Dashboard"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors hover:bg-white/15"
                >
                  <img
                    src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/home-2_wwzqrg.png"
                    alt="dashboard"
                    className="w-5 h-5 flex-shrink-0"
                  />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
              </li>

              {/* Teachers Link */}
              <li>
                <Link
                  to="/Teachers"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-white/10"
                >
                  <img
                    src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/teacher_mmxcpi.svg"
                    alt="teachers"
                    className="w-5 h-5 flex-shrink-0"
                  />
                  <span className="text-sm font-medium">Teachers</span>
                </Link>
              </li>

              {/* Students Link */}
              <li>
                <Link
                  to="/Student"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-white/10"
                >
                  <img
                    src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281721/Student_hunumx.svg"
                    alt="students"
                    className="w-5 h-5 flex-shrink-0"
                  />
                  <span className="text-sm font-medium">Students</span>
                </Link>
              </li>

              {/* Class Details Dropdown */}
              <li className="drop">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-white/10">
                    <svg className="w-5 h-5" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 nnn33336H2.00004C1.36004 8.33336 0.833374 7.8067 0.833374 7.1667V4.95336C0.833374 4.50002 1.14669 4.04003 1.56669 3.87336L7.56669 1.47338C7.82002 1.37338 8.18006 1.37338 8.43339 1.47338L14.4334 3.87336C14.8534 4.04003 15.1667 4.50669 15.1667 4.95336V7.1667C15.1667 7.8067 14.64 8.33336 14 8.33336ZM8.00004 2.39338C7.97337 2.39338 7.94672 2.39335 7.93339 2.40001L1.94002 4.80004C1.90002 4.82004 1.83337 4.90669 1.83337 4.95336V7.1667C1.83337 7.26003 1.90671 7.33336 2.00004 7.33336H14C14.0934 7.33336 14.1667 7.26003 14.1667 7.1667V4.95336C14.1667 4.90669 14.1067 4.82004 14.0601 4.80004L8.06006 2.40001C8.04673 2.39335 8.02671 2.39338 8.00004 2.39338Z" fill="white" />
                      <path d="M14.6667 15.6667H1.33337C1.06004 15.6667 0.833374 15.44 0.833374 15.1667V13.1667C0.833374 12.5267 1.36004 12 2.00004 12H14C14.64 12 15.1667 12.5267 15.1667 13.1667V15.1667C15.1667 15.44 14.94 15.6667 14.6667 15.6667ZM1.83337 14.6667H14.1667V13.1667C14.1667 13.0733 14.0934 13 14 13H2.00004C1.90671 13 1.83337 13.0733 1.83337 13.1667V14.6667Z" fill="white" />
                      <path d="M2.66663 13C2.39329 13 2.16663 12.7733 2.16663 12.5V7.83331C2.16663 7.55998 2.39329 7.33331 2.66663 7.33331C2.93996 7.33331 3.16663 7.55998 3.16663 7.83331V12.5C3.16663 12.7733 2.93996 13 2.66663 13Z" fill="white" />
                      <path d="M5.33337 13C5.06004 13 4.83337 12.7733 4.83337 12.5V7.83331C4.83337 7.55998 5.06004 7.33331 5.33337 7.33331C5.60671 7.33331 5.83337 7.55998 5.83337 7.83331V12.5C5.83337 12.7733 5.60671 13 5.33337 13Z" fill="white" />
                      <path d="M8 13C7.72667 13 7.5 12.7733 7.5 12.5V7.83331C7.5 7.55998 7.72667 7.33331 8 7.33331C8.27333 7.33331 8.5 7.55998 8.5 7.83331V12.5C8.5 12.7733 8.27333 13 8 13Z" fill="white" />
                      <path d="M10.6666 13C10.3933 13 10.1666 12.7733 10.1666 12.5V7.83331C10.1666 7.55998 10.3933 7.33331 10.6666 7.33331C10.94 7.33331 11.1666 7.55998 11.1666 7.83331V12.5C11.1666 12.7733 10.94 13 10.6666 13Z" fill="white" />
                      <path d="M13.3334 13C13.06 13 12.8334 12.7733 12.8334 12.5V7.83331C12.8334 7.55998 13.06 7.33331 13.3334 7.33331C13.6067 7.33331 13.8334 7.55998 13.8334 7.83331V12.5C13.8334 12.7733 13.6067 13 13.3334 13Z" fill="white" />
                      <path d="M15.3333 15.6667H0.666626C0.393293 15.6667 0.166626 15.44 0.166626 15.1667C0.166626 14.8934 0.393293 14.6667 0.666626 14.6667H15.3333C15.6066 14.6667 15.8333 14.8934 15.8333 15.1667C15.8333 15.44 15.6066 15.6667 15.3333 15.6667Z" fill="white" />
                      <path d="M8 6.66669C7.17333 6.66669 6.5 5.99335 6.5 5.16669C6.5 4.34002 7.17333 3.66669 8 3.66669C8.82667 3.66669 9.5 4.34002 9.5 5.16669C9.5 5.99335 8.82667 6.66669 8 6.66669ZM8 4.66669C7.72667 4.66669 7.5 4.89335 7.5 5.16669C7.5 5.44002 7.72667 5.66669 8 5.66669C8.27333 5.66669 8.5 5.44002 8.5 5.16669C8.5 4.89335 8.27333 4.66669 8 4.66669Z" fill="white" />
                    </svg>
                    <span className="text-sm font-medium">Class Details</span>
                  </DropdownMenuTrigger  >
                  <DropdownMenuContent
                    side="right"
                    align="start"
                    className="w-56 h-15 px-4 bg-[#152259] text-white contentdrop"
                  >
                    <Link to="/CreateClass" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg">
                      <svg className="w-5 h-5" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.33337 9.05332V10.5C1.33337 13.8333 2.66671 15.1666 6.00004 15.1666H10C13.3334 15.1666 14.6667 13.8333 14.6667 10.5V6.49998C14.6667 3.16665 13.3334 1.83331 10 1.83331H6.00004C2.66671 1.83331 1.33337 3.16665 1.33337 6.49998" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6.74003 7.93335H4.97337C4.55337 7.93335 4.21338 8.27332 4.21338 8.69332V12.1066H6.74003V7.93335V7.93335Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.50673 4.89996H7.49339C7.07339 4.89996 6.7334 5.23997 6.7334 5.65997V12.1H9.26007V5.65997C9.26007 5.23997 8.92673 4.89996 8.50673 4.89996Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M11.0334 9.06665H9.26672V12.1H11.7934V9.82666C11.7867 9.40666 11.4467 9.06665 11.0334 9.06665Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <span>Create Class</span>
                    </Link>

                    <Link to="/List" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg">
                      <svg className="w-5 h-5" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 nnn33336H2.00004C1.36004 8.33336 0.833374 7.8067 0.833374 7.1667V4.95336C0.833374 4.50002 1.14669 4.04003 1.56669 3.87336L7.56669 1.47338C7.82002 1.37338 8.18006 1.37338 8.43339 1.47338L14.4334 3.87336C14.8534 4.04003 15.1667 4.50669 15.1667 4.95336V7.1667C15.1667 7.8067 14.64 8.33336 14 8.33336ZM8.00004 2.39338C7.97337 2.39338 7.94672 2.39335 7.93339 2.40001L1.94002 4.80004C1.90002 4.82004 1.83337 4.90669 1.83337 4.95336V7.1667C1.83337 7.26003 1.90671 7.33336 2.00004 7.33336H14C14.0934 7.33336 14.1667 7.26003 14.1667 7.1667V4.95336C14.1667 4.90669 14.1067 4.82004 14.0601 4.80004L8.06006 2.40001C8.04673 2.39335 8.02671 2.39338 8.00004 2.39338Z" fill="white" />
                        <path d="M14.6667 15.6667H1.33337C1.06004 15.6667 0.833374 15.44 0.833374 15.1667V13.1667C0.833374 12.5267 1.36004 12 2.00004 12H14C14.64 12 15.1667 12.5267 15.1667 13.1667V15.1667C15.1667 15.44 14.94 15.6667 14.6667 15.6667ZM1.83337 14.6667H14.1667V13.1667C14.1667 13.0733 14.0934 13 14 13H2.00004C1.90671 13 1.83337 13.0733 1.83337 13.1667V14.6667Z" fill="white" />
                        <path d="M2.66663 13C2.39329 13 2.16663 12.7733 2.16663 12.5V7.83331C2.16663 7.55998 2.39329 7.33331 2.66663 7.33331C2.93996 7.33331 3.16663 7.55998 3.16663 7.83331V12.5C3.16663 12.7733 2.93996 13 2.66663 13Z" fill="white" />
                        <path d="M5.33337 13C5.06004 13 4.83337 12.7733 4.83337 12.5V7.83331C4.83337 7.55998 5.06004 7.33331 5.33337 7.33331C5.60671 7.33331 5.83337 7.55998 5.83337 7.83331V12.5C5.83337 12.7733 5.60671 13 5.33337 13Z" fill="white" />
                        <path d="M8 13C7.72667 13 7.5 12.7733 7.5 12.5V7.83331C7.5 7.55998 7.72667 7.33331 8 7.33331C8.27333 7.33331 8.5 7.55998 8.5 7.83331V12.5C8.5 12.7733 8.27333 13 8 13Z" fill="white" />
                        <path d="M10.6666 13C10.3933 13 10.1666 12.7733 10.1666 12.5V7.83331C10.1666 7.55998 10.3933 7.33331 10.6666 7.33331C10.94 7.33331 11.1666 7.55998 11.1666 7.83331V12.5C11.1666 12.7733 10.94 13 10.6666 13Z" fill="white" />
                        <path d="M13.3334 13C13.06 13 12.8334 12.7733 12.8334 12.5V7.83331C12.8334 7.55998 13.06 7.33331 13.3334 7.33331C13.6067 7.33331 13.8334 7.55998 13.8334 7.83331V12.5C13.8334 12.7733 13.6067 13 13.3334 13Z" fill="white" />
                        <path d="M15.3333 15.6667H0.666626C0.393293 15.6667 0.166626 15.44 0.166626 15.1667C0.166626 14.8934 0.393293 14.6667 0.666626 14.6667H15.3333C15.6066 14.6667 15.8333 14.8934 15.8333 15.1667C15.8333 15.44 15.6066 15.6667 15.3333 15.6667Z" fill="white" />
                        <path d="M8 6.66669C7.17333 6.66669 6.5 5.99335 6.5 5.16669C6.5 4.34002 7.17333 3.66669 8 3.66669C8.82667 3.66669 9.5 4.34002 9.5 5.16669C9.5 5.99335 8.82667 6.66669 8 6.66669ZM8 4.66669C7.72667 4.66669 7.5 4.89335 7.5 5.16669C7.5 5.44002 7.72667 5.66669 8 5.66669C8.27333 5.66669 8.5 5.44002 8.5 5.16669C8.5 4.89335 8.27333 4.66669 8 4.66669Z" fill="white" />
                      </svg>
                      <span>Class List</span>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>

              {/* Consistent spacing for other dropdowns */}
              <li className="mt-4 drop">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-white/10">
                    <svg className="w-5 h-5" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.33337 9.05332V10.5C1.33337 13.8333 2.66671 15.1666 6.00004 15.1666H10C13.3334 15.1666 14.6667 13.8333 14.6667 10.5V6.49998C14.6667 3.16665 13.3334 1.83331 10 1.83331H6.00004C2.66671 1.83331 1.33337 3.16665 1.33337 6.49998" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M6.74003 7.93335H4.97337C4.55337 7.93335 4.21338 8.27332 4.21338 8.69332V12.1066H6.74003V7.93335V7.93335Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M8.50673 4.89996H7.49339C7.07339 4.89996 6.7334 5.23997 6.7334 5.65997V12.1H9.26007V5.65997C9.26007 5.23997 8.92673 4.89996 8.50673 4.89996Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M11.0334 9.06665H9.26672V12.1H11.7934V9.82666C11.7867 9.40666 11.4467 9.06665 11.0334 9.06665Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span className="text-sm font-medium">Attendance</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="start"
                    className="w-56 bg-[#152259] text-white contentdrop2"
                  >
                    <Link to="/Setting" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg">
                      <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281722/setting-2_nxazfr.svg" alt="settings" className="w-5 h-5" />
                      <span>Attendance Setting</span>
                    </Link>

                    <Link to="/view" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg">
                      <svg className="w-5 h-5" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.33337 9.05332V10.5C1.33337 13.8333 2.66671 15.1666 6.00004 15.1666H10C13.3334 15.1666 14.6667 13.8333 14.6667 10.5V6.49998C14.6667 3.16665 13.3334 1.83331 10 1.83331H6.00004C2.66671 1.83331 1.33337 3.16665 1.33337 6.49998" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6.74003 7.93335H4.97337C4.55337 7.93335 4.21338 8.27332 4.21338 8.69332V12.1066H6.74003V7.93335V7.93335Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.50673 4.89996H7.49339C7.07339 4.89996 6.7334 5.23997 6.7334 5.65997V12.1H9.26007V5.65997C9.26007 5.23997 8.92673 4.89996 8.50673 4.89996Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M11.0334 9.06665H9.26672V12.1H11.7934V9.82666C11.7867 9.40666 11.4467 9.06665 11.0334 9.06665Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <span>View Attendance</span>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>

              <li className="mt-4 drop">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-white/10">
                    <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/teacher_mmxcpi.svg" alt="teachers" className="w-5 h-5" />
                    <span className="text-sm font-medium">Assign</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="start"
                    className="w-56 bg-[#152259] text-white contentdrop3"
                  >
                    <Link to="/AssignTeacher" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg">
                      <svg className="w-5 h-5" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.33337 9.05332V10.5C1.33337 13.8333 2.66671 15.1666 6.00004 15.1666H10C13.3334 15.1666 14.6667 13.8333 14.6667 10.5V6.49998C14.6667 3.16665 13.3334 1.83331 10 1.83331H6.00004C2.66671 1.83331 1.33337 3.16665 1.33337 6.49998" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6.74003 7.93335H4.97337C4.55337 7.93335 4.21338 8.27332 4.21338 8.69332V12.1066H6.74003V7.93335V7.93335Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.50673 4.89996H7.49339C7.07339 4.89996 6.7334 5.23997 6.7334 5.65997V12.1H9.26007V5.65997C9.26007 5.23997 8.92673 4.89996 8.50673 4.89996Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M11.0334 9.06665H9.26672V12.1H11.7934V9.82666C11.7867 9.40666 11.4467 9.06665 11.0334 9.06665Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <span>Assign Teacher</span>
                    </Link>
                    <Link to="/AssignStudents" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg">
                      <svg className="w-5 h-5" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.33337 9.05332V10.5C1.33337 13.8333 2.66671 15.1666 6.00004 15.1666H10C13.3334 15.1666 14.6667 13.8333 14.6667 10.5V6.49998C14.6667 3.16665 13.3334 1.83331 10 1.83331H6.00004C2.66671 1.83331 1.33337 3.16665 1.33337 6.49998" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6.74003 7.93335H4.97337C4.55337 7.93335 4.21338 8.27332 4.21338 8.69332V12.1066H6.74003V7.93335V7.93335Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.50673 4.89996H7.49339C7.07339 4.89996 6.7334 5.23997 6.7334 5.65997V12.1H9.26007V5.65997C9.26007 5.23997 8.92673 4.89996 8.50673 4.89996Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M11.0334 9.06665H9.26672V12.1H11.7934V9.82666C11.7867 9.40666 11.4467 9.06665 11.0334 9.06665Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <span>Assign Student</span>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              <Link to="/ListOfParent" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg">
                <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281721/food_cp4exu.svg" alt="settings" className="w-5 h-5" />
                <span>Parent List</span>
              </Link>
              <Link to="/Profile" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg">
                <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281722/setting-2_nxazfr.svg" alt="settings" className="w-5 h-5" />
                <span> Setting and profile</span>
              </Link>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 mt-7 main-content">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 ">
          <div className="description">
            <h1 className="text-2xl font-semibold text-[#4D44B5]">Send Invite</h1>
          </div>


          <div className="flex items-center gap-9 control ">
            <button className="p-2 hover:bg-gray-100 rounded-lg bg-white control-btn" width="38" height="38">
              <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281722/bell_muudfk.svg" alt="notifications" className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg bg-white control-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 32" fill="none">
                <path d="M12.2629 2.66669L11.4166 6.46617C10.9352 6.6978 10.4751 6.9646 10.0338 7.26565L6.32023 6.09637L2.58325 12.5703L5.39836 15.1485C5.28837 15.9648 5.33819 16.3672 5.39836 16.8516L2.58325 19.4297L6.32023 25.9037L10.0338 24.7344C10.4751 25.0354 10.9352 25.3022 11.4166 25.5339L12.2629 29.3334H19.7369L20.5833 25.5339C21.0646 25.3022 21.5248 25.0354 21.9661 24.7344L25.6796 25.9037L29.4166 19.4297L26.6015 16.8516C26.6245 16.5682 26.6663 16.2846 26.6666 16C26.6677 15.7069 26.6215 15.4108 26.6015 15.1485L29.4166 12.5703L25.6796 6.09637L21.9661 7.26565C21.5248 6.9646 21.0646 6.6978 20.5833 6.46617L19.7369 2.66669H12.2629ZM14.4036 5.33335H17.5963L18.2551 8.29169L18.9166 8.5521C19.6648 8.84513 20.3643 9.24847 20.9921 9.75002L21.5494 10.1927L24.44 9.28387L26.0364 12.0495L23.802 14.099L23.9088 14.8021C24.0344 15.5797 24.01 16.4746 23.9088 17.1979L23.802 17.9011L26.0364 19.9505L24.44 22.7162L21.5494 21.8073L20.9921 22.25C20.3643 22.7516 19.6648 23.1549 18.9166 23.4479L18.2551 23.7084L17.5963 26.6667H14.4036L13.7447 23.7084L13.0833 23.4479C12.335 23.1549 11.6356 22.7516 11.0077 22.25L10.4504 21.8073L7.55981 22.7162L5.96346 19.9505L8.19783 17.9011L8.09106 17.1979C7.96083 16.4047 7.98083 15.4967 8.09106 14.8021L8.19783 14.099L5.96346 12.0495L7.55981 9.28387L10.4504 10.1927L11.0077 9.75002C11.6356 9.24847 12.335 8.84513 13.0833 8.5521L13.7447 8.29169L14.4036 5.33335ZM15.9999 10.6667C13.0702 10.6667 10.6666 13.0703 10.6666 16C10.6666 18.9297 13.0702 21.3334 15.9999 21.3334C18.9296 21.3334 21.3333 18.9297 21.3333 16C21.3333 13.0703 18.9296 10.6667 15.9999 10.6667ZM15.9999 13.3334C17.4885 13.3334 18.6666 14.5115 18.6666 16C18.6666 17.4886 17.4885 18.6667 15.9999 18.6667C14.5114 18.6667 13.3333 17.4886 13.3333 16C13.3333 14.5115 14.5114 13.3334 15.9999 13.3334Z" fill="#A098AE" />
              </svg>
            </button>
            <div className="flex items-center gap-4">
              <div className="user">
                <div className="profile-picture">
                  <img 
                    src={user?.profile_picture || "https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281722/bell_muudfk.svg"} 
                    alt="profile" 
                    onError={(e) => {
                      e.target.src = "https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281722/bell_muudfk.svg";
                    }}
                  />
                </div>
                <div className="user-info">
                  <p className="welcome-message">{user?.name || "Joshua N."}</p>
                  <h5>Admin</h5>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="cove">
          <div className="cover-info">
            <div className="student-details">
              <h1>Student Details</h1>
            </div>
            <div className="form-container">
              <form onSubmit={formik.handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="error">{formik.errors.email}</p>
                )}

                <input
                  type="text"
                  name="student_name"
                  placeholder="Full Name"
                  value={formik.values.student_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.student_name && formik.errors.student_name && (
                  <p className="error">{formik.errors.student_name}</p>
                )}

                <input
                  type="date"
                  name="student_dob"
                  placeholder="student dob"
                  value={formik.values.student_dob}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.student_dob && formik.errors.student_dob && (
                  <p className="error">{formik.errors.student_dob}</p>
                )}
                <select
                  id="class_id"
                  name="class_id"
                  onChange={formik.handleChange}
                  value={formik.values.class_id}
                  disabled={loading}
                  className={loading ? 'loading' : ''}
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {formik.touched.class_id && formik.errors.class_id && (
                  <p className="error">{formik.errors.class_id}</p>
                )}
                <div className="wrap">
                  <div className="sel">
                    <select
                      name="gender"
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="" label="Select gender" />
                      <option value="Male" label="Male" />
                      <option value="Female" label="Female" />
                      <option value="Other" label="Other" />
                    </select>
                    {formik.touched.gender && formik.errors.gender && (
                      <p className="error rbtn">{formik.errors.gender}</p>
                    )}
                  </div>


                  <button type="submit">Add Student</button>
                </div>

              </form>
            </div>
          </div>
        </div>



      </div>
    </div>
  );
};

export default AddStudents;


