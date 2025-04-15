import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "https://attendipen-d65abecaffe3.herokuapp.com";

const SchoolEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    motto: '',
    session: '',
    term: '',
    logo: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      logo: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      console.log("Submitting school info update...");
      console.log("Form data:", formData);

      const data = new FormData();
      data.append('motto', formData.motto);
      data.append('session', formData.session);
      data.append('term', formData.term);
      if (formData.logo) {
        data.append('logo', formData.logo);
      }

      const response = await axios.put(
        `${BASE_URL}/settings/edit`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("Update response:", response.data);

      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "School information updated successfully",
          icon: "success",
        }).then(() => {
          navigate("/dashboard");
        });
      }
    } catch (error) {
      console.error("Error updating school info:", error);
      setError(error.response?.data?.message || "Failed to update school information");
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to update school information",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header>
        <h1>Edit School Information</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="motto">School Motto</label>
          <input
            type="text"
            id="motto"
            name="motto"
            value={formData.motto}
            onChange={handleInputChange}
            placeholder="Enter school motto"
            required
          />
        </div>

        <div>
          <label htmlFor="session">Academic Session</label>
          <input
            type="text"
            id="session"
            name="session"
            value={formData.session}
            onChange={handleInputChange}
            placeholder="e.g., 2024/2025"
            required
          />
        </div>

        <div>
          <label htmlFor="term">Current Term</label>
          <input
            type="text"
            id="term"
            name="term"
            value={formData.term}
            onChange={handleInputChange}
            placeholder="e.g., Second Term"
            required
          />
        </div>

        <div>
          <label htmlFor="logo">School Logo</label>
          <input
            type="file"
            id="logo"
            name="logo"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        {error && <div>Error: {error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update School Information'}
        </button>
      </form>
    </div>
  );
};

export default SchoolEdit;
