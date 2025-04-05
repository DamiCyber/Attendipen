import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const SchoolViewAllAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire("Authentication Error", "Please log in to continue.", "error");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `https://attendipen-d65abecaffe3.herokuapp.com/attendance/view/1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.attendance) {
          setAttendanceData(response.data.attendance);
        } else {
          setAttendanceData([]);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to fetch attendance.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [navigate]);

  if (loading) return <p>Loading attendance data...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">School Attendance Records</h2>

      {attendanceData.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Student Name</th>
                <th className="border px-4 py-2">Class</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr key={index} className="border">
                  <td className="border px-4 py-2">{record.student_name}</td>
                  <td className="border px-4 py-2">{record.class_name}</td>
                  <td className="border px-4 py-2">{record.date}</td>
                  <td className="border px-4 py-2">
                    <span className={`px-2 py-1 rounded ${
                      record.status === "present" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="border px-4 py-2">{record.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SchoolViewAllAttendance;
