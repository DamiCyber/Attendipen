import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../assets/style/dashboard.css";
import "../assets/style/createclass.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse, 
  faSchool, 
  faGraduationCap, 
  faCalendar, 
  faChalkboard, 
  faBook, 
  faHandsHoldingChild,
  faGear,
  faEye,
  faClipboardUser,
  faChartColumn,
  faPlus,
  faLinesLeaning
} from '@fortawesome/free-solid-svg-icons';
const CreateClass = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isClassroomOpen, setIsClassroomOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

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
  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please login to continue",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login");
      });
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleAttendance = () => {
    setIsAttendanceOpen(!isAttendanceOpen);
  };

  const toggleClassroom = () => {
    setIsClassroomOpen(!isClassroomOpen);
  };

  const toggleAssign = () => {
    setIsAssignOpen(!isAssignOpen);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please login again.");
      setLoading(false);
      Swal.fire({
        title: "Authentication Required",
        text: "Please login to continue",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    if (!formData.name.trim()) {
      setError("Class name is required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://attendipen-d65abecaffe3.herokuapp.com/classes",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Class created successfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/classroom/list");
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem("token");
        Swal.fire({
          title: "Session Expired",
          text: "Please login again to continue",
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/login");
        });
      } else {
        setError(
          error.response?.data?.message || "Failed to create class. Please try again."
        );
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to create class",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
             <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
        <div className="logo">
            <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1745508053/1f4177ed-47e3-4a5a-b5f3-0e8adf1595c3-removebg-preview_celvbn.png" alt="" />
          </div>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? '←' : '→'}
          </button>
        </div>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/dashboard" className="nav-link">
                <span className="icon">
                  <FontAwesomeIcon icon={faHouse} className="nav-icon" />
                </span>
                {isSidebarOpen && <span className="text">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link to="/teachers" className="nav-link">
                <span className="icon">
                  <FontAwesomeIcon icon={faSchool} className="nav-icon" />
                </span>
                {isSidebarOpen && <span className="text">Teachers</span>}
              </Link>
            </li>
            <li>
              <Link to="/students" className="nav-link">
                <span className="icon">
                  <FontAwesomeIcon icon={faGraduationCap} className="nav-icon" />
                </span>
                {isSidebarOpen && <span className="text">Students</span>}
              </Link>
            </li>
            <li className="dropdown-container">
              <div className="nav-link dropdown-header" onClick={toggleAttendance}>
                <span className="icon">
                  <FontAwesomeIcon icon={faCalendar} className="nav-icon" />
                </span>
                {isSidebarOpen && (
                  <>
                    <span className="text">Attendance</span>
                    <span className={`dropdown-arrow ${isAttendanceOpen ? 'open' : ''}`}>▼</span>
                  </>
                )}
              </div>
              {isSidebarOpen && isAttendanceOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/settings" className="dropdown-link">
                      <span className="icon"><FontAwesomeIcon icon={faClipboardUser} className="nav-icon" /></span>
                      <span className="text">Attendance Setting</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/attendance/view" className="dropdown-link">
                      <span className="icon"><FontAwesomeIcon icon={faChartColumn} className="nav-icon" /></span>
                      <span className="text">View Attendance</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="dropdown-container">
              <div className="nav-link dropdown-header" onClick={toggleClassroom}>
                <span className="icon">
                  <FontAwesomeIcon icon={faChalkboard} className="nav-icon" />
                </span>
                {isSidebarOpen && (
                  <>
                    <span className="text">Classroom</span>
                    <span className={`dropdown-arrow ${isClassroomOpen ? 'open' : ''}`}>▼</span>
                  </>
                )}
              </div>
              {isSidebarOpen && isClassroomOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/classroom/create" className="dropdown-link">
                      <span className="icon">
                        <FontAwesomeIcon icon={faPlus} className="nav-icon" />
                      </span>
                      <span className="text">Create Class</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/classroom/list" className="dropdown-link">
                      <span className="icon"><FontAwesomeIcon icon={faLinesLeaning} className="nav-icon" /></span>
                      <span className="text">Class List</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="dropdown-container">
              <div className="nav-link dropdown-header" onClick={toggleAssign}>
                <span className="icon">
                  <FontAwesomeIcon icon={faBook} className="nav-icon" />
                </span>
                {isSidebarOpen && (
                  <>
                    <span className="text">Assign</span>
                    <span className={`dropdown-arrow ${isAssignOpen ? 'open' : ''}`}>▼</span>
                  </>
                )}
              </div>
              {isSidebarOpen && isAssignOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/teachers/assign" className="dropdown-link">
                      <span className="icon"><FontAwesomeIcon icon={faPlus} className="nav-icon" /></span>
                      <span className="text">Assign Teacher</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/students/assign" className="dropdown-link">
                      <span className="icon"><FontAwesomeIcon icon={faPlus} className="nav-icon" /></span>
                      <span className="text">Assign Student</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/subjects/assign-to-class" className="dropdown-link">
                      <span className="icon"><FontAwesomeIcon icon={faPlus} className="nav-icon" /></span>
                      <span className="text">Assign Subject</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/parents/list" className="nav-link">
                <span className="icon">
                  <FontAwesomeIcon icon={faHandsHoldingChild} className="nav-icon" />
                </span>
                {isSidebarOpen && <span className="text">Parents</span>}
              </Link>
            </li>
            <li>
              <Link to="/school/profile" className="nav-link">
                <span className="icon">
                  <FontAwesomeIcon icon={faGear} className="nav-icon" />
                </span>
                {isSidebarOpen && <span className="text">Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="header">
          <div className="header-left">
            <h1 className="dashboard-title">Create New Class</h1>
          </div>
          <form className="search-form">
            <button type="button">
              <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
            <input className="search-input" placeholder="Search..." required type="text" />
            <button className="reset" type="reset">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </form>
          <div className="user">
            <div className="profile-picture">
              <img 
                src={user?.profile_picture || "https://via.placeholder.com/40"} 
                alt="Profile" 
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/40";
                }}
              />
            </div>
            <div className="user-info">
              <h4 className="welcome-message">{user?.name || "Admin"}</h4>
              <h5>Admin</h5>
            </div>
          </div>
        </div>
        <div className="content-body">
          <div className="cove">
            <div className="cover-info">
              <div className="student-details">
                <h2 className="m-white">Create New Class</h2>
              </div>
              <div className="form-container class ">
                <form onSubmit={handleSubmit} className="forall">
                  <div className="form-group">
                    <label htmlFor="name">Class Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter class name (e.g., JSS 1)"
                      required
                    />
                    {error && <p className="error-message">{error}</p>}
                  </div>

                  <div className="button-group">
                    <button
                      type="submit"
                      className="create-btn"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Class"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClass;
