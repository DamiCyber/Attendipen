import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AcceptTeacher = () => {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAcceptOffer = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      Swal.fire({
        title: 'Authentication Error',
        text: 'Please log in to continue.',
        icon: 'error',
      });
      navigate('/login');
      return;
    }

    if (!inviteId) {
      Swal.fire({
        title: 'Invalid Invitation',
        text: 'No invitation ID provided.',
        icon: 'error',
      });
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `https://attendipen-d65abecaffe3.herokuapp.com/invites/accept_offer/${inviteId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'You have successfully accepted the teaching position.',
          icon: 'success',
        }).then(() => {
          navigate('/TeachersDashboard');
        });
      } else {
        setError('Failed to accept the offer. Please try again.');
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
      setError(error.response?.data?.message || 'Failed to accept the offer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Teaching Position Offer</h2>
          <p className="text-gray-600">
            You have been invited to join as a teacher. Would you like to accept this position?
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={handleAcceptOffer}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors duration-200`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Accept Teaching Position'
            )}
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 px-4 rounded-lg text-gray-700 font-semibold bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptTeacher;
