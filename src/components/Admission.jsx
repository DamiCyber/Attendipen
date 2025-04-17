import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "https://attendipen-d65abecaffe3.herokuapp.com";

const Admission = () => {
  const navigate = useNavigate();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      console.log("Fetching admission invites...");
      console.log("Using token:", token);

      const response = await axios.get(
        `${BASE_URL}/invites/my_invites`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("API Response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setInvites(response.data);
      } else {
        console.error("Invalid data format received:", response.data);
        setError("Invalid data format received from server");
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admission invites:", error);
      setError(error.response?.data?.message || "Failed to fetch admission invites");
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to fetch admission invites",
        icon: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, [navigate]);

  const handleAcceptInvite = async (inviteId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      console.log("Accepting admission for invite ID:", inviteId);
      console.log("Using token:", token);

      const response = await axios.post(
        `${BASE_URL}/invites/accept_admission/${inviteId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Accept admission response:", response.data);

      if (response.status === 200) {
        console.log("Admission accepted successfully");
        // Refresh invites list
        fetchInvites();
        // Navigate to admission page
        navigate("/admission");
      } else {
        console.warn("Unexpected response status:", response.status);
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error accepting admission:", error);
      console.error("Error response:", error.response);
      
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Failed to accept admission";
      
      console.error("Error message:", errorMessage);
      
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D44B5]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admission Invites</h1>
        
        {invites.length === 0 ? (
          <div className="text-center text-gray-500">
            No admission invites available
          </div>
        ) : (
          <div className="grid gap-4">
            {invites.map((invite) => (
              <div key={invite.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{invite.student_name}</h2>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Class ID:</span> {invite.class_id}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">School ID:</span> {invite.school_id}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Invited on:</span> {new Date(invite.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      invite.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : invite.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                    </span>
                    {invite.status === 'pending' && (
                      <button
                        onClick={() => handleAcceptInvite(invite.id)}
                        className="mt-2 bg-[#4D44B5] text-white px-4 py-2 rounded hover:bg-[#3a32a0] transition-colors"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admission;
