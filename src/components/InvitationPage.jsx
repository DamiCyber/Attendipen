import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "https://attendipen-d65abecaffe3.herokuapp.com";

const InvitationPage = () => {
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

      console.log("Fetching invites...");
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
      console.error("Error fetching invites:", error);
      setError(error.response?.data?.message || "Failed to fetch invites");
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to fetch invites",
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

      console.log("Accepting teacher offer for invite ID:", inviteId);
      console.log("Using token:", token);

      const response = await axios.post(
        `${BASE_URL}/invites/accept_offer/${inviteId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Accept offer response:", response.data);

      if (response.status === 200) {
        console.log("Teacher offer accepted successfully");
        Swal.fire({
          title: "Success",
          text: "Teacher offer accepted successfully",
          icon: "success",
        }).then(() => {
          // Refresh invites list
          fetchInvites();
          // Navigate to teacher dashboard
          navigate("/invitation");
        });
      } else {
        console.warn("Unexpected response status:", response.status);
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error accepting teacher offer:", error);
      console.error("Error response:", error.response);
      
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Failed to accept teacher offer";
      
      console.error("Error message:", errorMessage);
      
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  const handleRejectInvite = async (inviteId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      console.log("Rejecting invite:", inviteId);

      const response = await axios.post(
        `${BASE_URL}/invites/${inviteId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Reject response:", response.data);

      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Invitation rejected successfully",
          icon: "success",
        });
        // Refresh invites list
        fetchInvites();
      }
    } catch (error) {
      console.error("Error rejecting invite:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to reject invitation",
        icon: "error",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <header>
        <h1>My Invitations</h1>
      </header>

      <div>
        {invites.length === 0 ? (
          <div>
            <p>No invitations found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>School</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((invite) => (
                <tr key={invite.id}>
                  <td>{invite.school_name}</td>
                  <td>{invite.role}</td>
                  <td>{invite.status}</td>
                  <td>
                    {invite.status === 'pending' && (
                      <>
                        <button onClick={() => handleAcceptInvite(invite.id)}>
                          Accept Offer
                        </button>
                        <button onClick={() => handleRejectInvite(invite.id)}>
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InvitationPage;
