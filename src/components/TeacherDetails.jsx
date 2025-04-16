import React from 'react';
import { useLocation } from 'react-router-dom';
import "../assets/style/profile.css";

const TeacherDetails = () => {
  const location = useLocation();
  const { teacher } = location.state || {};

  if (!teacher) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">No teacher data available</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F9F9F9]">
      {/* Sidebar */}
      <div className="w-64 bg-[#4D44B5] text-white sidebar">
        {/* ... Your existing sidebar code ... */}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 mt-7 main-content">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="description">
            <h1 className="text-2xl font-semibold text-[#4D44B5]">Teacher Details</h1>
          </div>
        </header>

        <div className="main-content">
          <div className="content">
            <div className="student-details">
              <h2 className='m-white'>Teacher Information</h2>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#4D44B5] mb-4">Personal Information</h3>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Name</span>
                    <span className="text-base font-medium">{teacher.name}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-base font-medium">{teacher.email}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Phone Number</span>
                    <span className="text-base font-medium">{teacher.phone_number}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Gender</span>
                    <span className="text-base font-medium capitalize">{teacher.gender}</span>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#4D44B5] mb-4">Professional Information</h3>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">About</span>
                    <span className="text-base font-medium">{teacher.about}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Address</span>
                    <span className="text-base font-medium">{teacher.address}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Salary</span>
                    <span className="text-base font-medium">₦{teacher.salary.toLocaleString()}</span>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-[#4D44B5] mb-4">Account Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Created At</span>
                      <span className="text-base font-medium">{new Date(teacher.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Last Updated</span>
                      <span className="text-base font-medium">{new Date(teacher.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails; 