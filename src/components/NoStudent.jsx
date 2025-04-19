import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const NoStudent = () => {

  const { classId } = useParams(); // Get classId from URL
  const [students, setStudents] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); const navigate = useNavigate();
  const BASE_URL = "https://attendipen-d65abecaffe3.herokuapp.com";

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if no token
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/classes/${classId}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(response.data); // Assuming response.data is an array of students
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [classId, navigate]);

  return (

    <div className="Api-map-out">
      {/* Api to be displayed here */}
      <h1>Students in Class {classId}</h1>
      {students.length === 0 ? (
        <p></p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              {student.name} - {student.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NoStudent;


