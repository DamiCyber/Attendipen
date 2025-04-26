import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../assets/style/student.css";
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
  faLinesLeaning,
  faUser
} from '@fortawesome/free-solid-svg-icons';
const Student = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [studentPictures, setStudentPictures] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isClassroomOpen, setIsClassroomOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

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

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "https://attendipen-d65abecaffe3.herokuapp.com/students/all?type=object",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setStudents(response.data);
        setLoading(false);

        const pictures = {};
        for (const student of response.data) {
          try {
            const pictureResponse = await axios.get(
              `https://attendipen-d65abecaffe3.herokuapp.com/students/${student.id}?type=profile_picture`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                responseType: 'blob'
              }
            );
            pictures[student.id] = URL.createObjectURL(pictureResponse.data);
          } catch (pictureError) {
            console.log(`No profile picture found for student ${student.id}`);
          }
        }
        setStudentPictures(pictures);
      } catch (error) {
        console.error("Error fetching students:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch student data",
          icon: "error",
        });
        setLoading(false);
      }
    };

    fetchStudents();
  }, [navigate]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toString().includes(searchQuery) ||
        (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading Students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
     

      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="header">
          <div className="header-left">
            <h1 className="dashboard-title">Students</h1>
          </div>
          <div className="user">
            <div className="profile-picture">
              <img
                src={user?.profile_picture || ""}
                alt="Profile"
                onError={(e) => {
                  e.target.src = "";
                }}
              />
            </div>
            <div className="user-info">
              <h4 className="welcome-message">{user?.name || "Loading..."}</h4>
              <h5>Admin</h5>
            </div>
          </div>
        </div>
        <div className="searadd">
          <form className="search-form">
            <button type="button">
              <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
            <input
              className="search-input"
              placeholder="Search students..."
              type="text"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button className="reset" type="reset" onClick={() => setSearchQuery("")}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </form>

        </div>
        <div className="content-body">
          <div className="students-grid">
            {filteredStudents.length > 0 ? (
              <div className="students-list">
            {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="student-card"
                  >
                    <div className="profile-picture-container">
                      {studentPictures[student.id] ? (
                        <img
                          src={studentPictures[student.id]}
                          alt={`${student.name}'s profile`}
                          className="profile-picture"
                          onError={(e) => {
                            e.target.src = "https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281722/bell_muudfk.svg";
                          }}
                        />
                      ) : (
                        <div className="profile-placeholder">
                          {student.name ? student.name.charAt(0).toUpperCase() : "?"}
                        </div>
                      )}
                    </div>
                    <div className="card-actions">
                    </div>
                    <h3>{student.name || "Unnamed Student"}</h3>

                    <div className="student-info">
                      <div className="info-row">
                        <span>ID:</span>
                        <span>{student.id}</span>
                      </div>
                      <div className="info-row">
                        <span>DOB:</span>
                        <span>{student.dob || "Not set"}</span>
                      </div>
                      <div className="info-row">
                        <span>Gender:</span>
                        <span>
                          {student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : "Not set"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-students">
                <p>No students found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student;
