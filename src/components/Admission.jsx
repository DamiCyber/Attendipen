import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Admission = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'Please login to continue', 'error');
      return;
    }

    try {
      const response = await axios.get(
        'https://attendipen-d65abecaffe3.herokuapp.com/invites/my_invites',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setInvites(response.data.invites || []);
      }
    } catch (error) {
      console.error('Error fetching invites:', error);
      Swal.fire('Error', 'Failed to fetch admission invites', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async (inviteId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'Please login to continue', 'error');
      return;
    }

    setAccepting(true);
    try {
      const response = await axios.post(
        `https://attendipen-d65abecaffe3.herokuapp.com/invites/accept_admission/${inviteId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        Swal.fire('Success', 'Admission accepted successfully', 'success');
        // Refresh the invites list
        fetchInvites();
      }
    } catch (error) {
      console.error('Error accepting invite:', error);
      Swal.fire('Error', 'Failed to accept admission', 'error');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Admission Invites</h2>
        
        {invites.length === 0 ? (
          <div className="text-center text-gray-500">
            No admission invites found
          </div>
        ) : (
          <div className="grid gap-4">
            {invites.map((invite) => (
              <div key={invite.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{invite.school_name}</h3>
                    <p className="text-gray-600">Student: {invite.student_name}</p>
                    <p className="text-gray-600">Class: {invite.class_name}</p>
                    <p className="text-gray-600">Status: {invite.status}</p>
                  </div>
                  {invite.status === 'pending' && (
                    <button
                      onClick={() => handleAcceptInvite(invite.id)}
                      disabled={accepting}
                      className={`px-4 py-2 rounded-md text-white font-semibold ${
                        accepting
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } transition-colors duration-200`}
                    >
                      {accepting ? 'Accepting...' : 'Accept Invite'}
                    </button>
                  )}
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
