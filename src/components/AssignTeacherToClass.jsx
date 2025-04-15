import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AssignTeacherToClass = () => {
  const [formData, setFormData] = useState({
    class_id: '',
    teacher_id: ''
  });
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch classes and teachers when component mounts
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://attendipen-d65abecaffe3.herokuapp.com/classes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch classes'
      });
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://attendipen-d65abecaffe3.herokuapp.com/teachers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch teachers'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://attendipen-d65abecaffe3.herokuapp.com/classes/assign_teacher',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Teacher assigned to class successfully'
        });
        // Reset form
        setFormData({
          class_id: '',
          teacher_id: ''
        });
      }
    } catch (error) {
      console.error('Error assigning teacher:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to assign teacher to class'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-6 text-center">Assign Teacher to Class</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="class_id" className="block text-sm font-medium text-gray-700">
                      Select Class
                    </label>
                    <select
                      id="class_id"
                      name="class_id"
                      value={formData.class_id}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="">Select a class</option>
                      {classes.map((classItem) => (
                        <option key={classItem.id} value={classItem.id}>
                          {classItem.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700">
                      Select Teacher
                    </label>
                    <select
                      id="teacher_id"
                      name="teacher_id"
                      value={formData.teacher_id}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="">Select a teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Assigning...' : 'Assign Teacher'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTeacherToClass; 