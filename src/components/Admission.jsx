import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_URL = "https://attendipen-d65abecaffe3.herokuapp.com";

const Admission = () => {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admissionData, setAdmissionData] = useState(null);

  const fetchAdmissionDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/invites/admission/${inviteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAdmissionData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admission details:", error);
      setError(error.response?.data?.message || "Failed to fetch admission details");
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to fetch admission details",
        icon: "error",
      });
      setLoading(false);
    }
  };

  const handleAcceptAdmission = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const result = await Swal.fire({
        title: "Accept Admission",
        text: "Are you sure you want to accept this admission? This will enroll the student in the school.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, accept it!",
      });

      if (result.isConfirmed) {
        setLoading(true);
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

        if (response.status === 200 || response.status === 201) {
          Swal.fire({
            title: "Success!",
            text: "Admission accepted successfully. The student has been enrolled in the school.",
            icon: "success",
          }).then(() => {
            // Redirect based on user type
            const userType = localStorage.getItem("userType");
            if (userType === "parent") {
              navigate("/parent/dashboard");
            } else {
              navigate("/dashboard");
            }
          });
        }
      }
    } catch (error) {
      console.error("Error accepting admission:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to accept admission",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inviteId) {
      fetchAdmissionDetails();
    }
  }, [inviteId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-6 text-center">Admission Details</h2>
                
                {admissionData && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-semibold">Student Name:</span>
                      <span>{admissionData.student_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Class:</span>
                      <span>{admissionData.class_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">School:</span>
                      <span>{admissionData.school_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Status:</span>
                      <span className={`px-2 py-1 rounded ${
                        admissionData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        admissionData.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {admissionData.status}
                      </span>
                    </div>
                    {admissionData.invite_date && (
                      <div className="flex justify-between">
                        <span className="font-semibold">Invitation Date:</span>
                        <span>{new Date(admissionData.invite_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-6">
                  <button
                    onClick={handleAcceptAdmission}
                    disabled={loading || (admissionData && admissionData.status === 'accepted')}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      loading || (admissionData && admissionData.status === 'accepted')
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {loading ? 'Processing...' : 'Accept Admission'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admission;

