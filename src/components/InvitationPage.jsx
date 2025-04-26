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
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/invites/my_invites`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        // Fetch school details for each invite
        const invitesWithSchoolDetails = await Promise.all(
          response.data.map(async (invite) => {
            try {
              const schoolResponse = await axios.get(
                `${BASE_URL}/schools/${invite.school_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              return {
                ...invite,
                school_name: schoolResponse.data.name,
                school_email: schoolResponse.data.email
              };
            } catch (error) {
              console.error("Error fetching school details:", error);
              return {
                ...invite,
                school_name: "Unknown School",
                school_email: "Unknown Email"
              };
            }
          })
        );
        setInvites(invitesWithSchoolDetails);
      } else {
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
        navigate("/login");
        return;
      }

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

      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Teacher offer accepted successfully",
          icon: "success",
        }).then(() => {
          fetchInvites();
          navigate("/invitation");
        });
      }
    } catch (error) {
      console.error("Error accepting teacher offer:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to accept teacher offer",
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

      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Invitation rejected successfully",
          icon: "success",
        });
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
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Invitations</h1>
        
        {invites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No invitations found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invites.map((invite) => (
                  <tr key={invite.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invite.salary}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invite.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        invite.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {invite.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {invite.status === 'pending' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleAcceptInvite(invite.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectInvite(invite.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationPage;
