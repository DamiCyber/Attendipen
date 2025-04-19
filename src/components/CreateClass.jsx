import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const CreateClass = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

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
          navigate("/List");
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

    <div className="cove">
      <div className="cover-info">
        <div className="student-details">
          <h2 className="m-white">Create New Class</h2>
        </div>
        <div className="form-container class">
          <form onSubmit={handleSubmit}>
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
  );
};

export default CreateClass;
