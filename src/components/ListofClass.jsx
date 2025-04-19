import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";



const ListofClass = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const fetchClasses = async () => {
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
      return;
    }

    try {
      const response = await axios.get(
        "https://attendipen-d65abecaffe3.herokuapp.com/classes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000, // 10 second timeout
        }
      );
      setClasses(response.data);
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setError("Request timed out. Please try again.");
      } else if (error.response?.status === 401) {
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
        setError("Failed to fetch classes. Please try again.");
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch classes",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDeleteClass = async (classId) => {
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
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `https://attendipen-d65abecaffe3.herokuapp.com/classes/${classId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire("Deleted!", "The class has been deleted.", "success");
        fetchClasses(); // Refresh the list
      }
    } catch (error) {
      if (error.response?.status === 401) {
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
        Swal.fire("Error!", "Failed to delete class.", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F9F9F9]">
        {/* Sidebar */}
     

        {/* Main Content */}
        <div className="flex-1 p-8 mt-7 main-content">
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#4D44B5] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#4D44B5] font-medium">Loading classes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={fetchClasses} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
  <div className="list-class-container">
  <div className="header">
    <h2>Class List</h2>
    <Link to="/CreateClass" className="create-btn">
      Create New Class
    </Link>
  </div>

  <div className="class-list ">
    {classes.length === 0 ? (
      <div className="no-classes wider">
        <p>No classes found. Create your first class!</p>
        <Link to="/create-class" className="create-first-btn">
          Create Class
        </Link>
      </div>
    ) : (
      classes.map((classItem) => (
        <div key={classItem.id} className="class-card">
          <div className="class-info">
            <h3>{classItem.name}</h3>
          </div>
          <div className="class-actions">
            <button
              className="view-btn"
              onClick={() => navigate(`/class/${classItem.id}/NoStudent`)}
            >
              View Students
            </button>
            <button
              className="delete-btn"
              onClick={() => handleDeleteClass(classItem.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))
    )}
  </div>
</div>
  );
};

export default ListofClass;
