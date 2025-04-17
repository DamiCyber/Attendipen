import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "../assets/style/dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

const TeachersDashboard = () => {
  const [date, setDate] = React.useState(new Date());
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const chartData = [
    { day: "Mon", red: 220, yellow: 270 },
    { day: "Tue", red: 170, yellow: 120 },
    { day: "Wed", red: 90, yellow: 100 },
    { day: "Thu", red: 120, yellow: 170 },
    { day: "Fri", red: 70, yellow: 90 },
    { day: "Sat", red: 250, yellow: 220 },
    { day: "Sun", red: 210, yellow: 270 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-[#FB7D5B]">This Week: {payload[0].value}</p>
          <p className="text-[#FCC43E]">Last Week: {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-[#F9F9F9]">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#4D44B5] text-white rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static w-64 bg-[#4D44B5] text-white sidebar transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } z-40 h-full`}
      >
        <div className="p-6 pb-4">
          <div className="flex flex-col items-center gap-4 mb-8">
            <img
              src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1734938938/amend_lntakp.png"
              alt="logo"
              className="w-30 h-30 object-contain"
            />
            <h1 className="text-xl font-semibold tracking-tight">Attendipen</h1>
          </div>
          <div className="border" />

          <nav className="flex-1">
            <ul className="space-y-4">
              {/* Dashboard Link */}
              <li>
                <Link
                  to="/TeachersDashboard"
                  className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg transition-colors hover:bg-white/15"
                >
                  <img
                    src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/home-2_wwzqrg.png"
                    alt="dashboard"
                    className="w-5 h-5 flex-shrink-0"
                  />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
              </li>

              {/* Teachers Link */}
              <li>
                <Link
                  to="/Mark"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-white/10"
                >
                  <img
                    src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/teacher_mmxcpi.svg"
                    alt="teachers"
                    className="w-5 h-5 flex-shrink-0"
                  />
                  <span className="text-sm font-medium">Attendance</span>
                </Link>
              </li>

              {/* Students Link */}
              <li>
                <Link
                  to="/ResultUpload"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-white/10"
                >
                  <img
                    src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281721/Student_hunumx.svg"
                    alt="students"
                    className="w-5 h-5 flex-shrink-0"
                  />
                  <span className="text-sm font-medium">Upload Result</span>
                </Link>
              </li>

              {/* Other Navigation Links */}
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg">
                <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281722/setting-2_nxazfr.svg" alt="settings" className="w-5 h-5" />
                <span>Settings and Profile</span>
              </Link>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8 mt-7 main-content overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <div className="description">
            <h1 className="text-2xl font-semibold text-[#4D44B5]">Dashboard</h1>
          </div>
          <div className="w-full lg:w-auto">
            <div className="relative form">
              <button className="absolute left-4 -translate-y-1/2 top-1/2 p-1">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-labelledby="search"
                  className="w-5 h-5 text-gray-700"
                >
                  <path
                    d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                    stroke="currentColor"
                    strokeWidth="1.333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
              <input
                className="input rounded-full px-12 py-4 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md w-full lg:w-[300px] searchall"
                placeholder="Search..."
                required=""
                type="text"
              />
              <button type="reset" className="absolute right-3 -translate-y-1/2 top-1/2 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 control">
            <button className="p-2 hover:bg-gray-100 rounded-lg bg-white control-btn">
              <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281722/bell_muudfk.svg" alt="notifications" className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg bg-white control-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 32" fill="none">
                <path d="M12.2629 2.66669L11.4166 6.46617C10.9352 6.6978 10.4751 6.9646 10.0338 7.26565L6.32023 6.09637L2.58325 12.5703L5.39836 15.1485C5.28837 15.9648 5.33819 16.3672 5.39836 16.8516L2.58325 19.4297L6.32023 25.9037L10.0338 24.7344C10.4751 25.0354 10.9352 25.3022 11.4166 25.5339L12.2629 29.3334H19.7369L20.5833 25.5339C21.0646 25.3022 21.5248 25.0354 21.9661 24.7344L25.6796 25.9037L29.4166 19.4297L26.6015 16.8516C26.6245 16.5682 26.6663 16.2846 26.6666 16C26.6677 15.7069 26.6215 15.4108 26.6015 15.1485L29.4166 12.5703L25.6796 6.09637L21.9661 7.26565C21.5248 6.9646 21.0646 6.6978 20.5833 6.46617L19.7369 2.66669H12.2629ZM14.4036 5.33335H17.5963L18.2551 8.29169L18.9166 8.5521C19.6648 8.84513 20.3643 9.24847 20.9921 9.75002L21.5494 10.1927L24.44 9.28387L26.0364 12.0495L23.802 14.099L23.9088 14.8021C24.0344 15.5797 24.01 16.4746 23.9088 17.1979L23.802 17.9011L26.0364 19.9505L24.44 22.7162L21.5494 21.8073L20.9921 22.25C20.3643 22.7516 19.6648 23.1549 18.9166 23.4479L18.2551 23.7084L17.5963 26.6667H14.4036L13.7447 23.7084L13.0833 23.4479C12.335 23.1549 11.6356 22.7516 11.0077 22.25L10.4504 21.8073L7.55981 22.7162L5.96346 19.9505L8.19783 17.9011L8.09106 17.1979C7.96083 16.4047 7.98083 15.4967 8.09106 14.8021L8.19783 14.099L5.96346 12.0495L7.55981 9.28387L10.4504 10.1927L11.0077 9.75002C11.6356 9.24847 12.335 8.84513 13.0833 8.5521L13.7447 8.29169L14.4036 5.33335ZM15.9999 10.6667C13.0702 10.6667 10.6666 13.0703 10.6666 16C10.6666 18.9297 13.0702 21.3334 15.9999 21.3334C18.9296 21.3334 21.3333 18.9297 21.3333 16C21.3333 13.0703 18.9296 10.6667 15.9999 10.6667ZM15.9999 13.3334C17.4885 13.3334 18.6666 14.5115 18.6666 16C18.6666 17.4886 17.4885 18.6667 15.9999 18.6667C14.5114 18.6667 13.3333 17.4886 13.3333 16C13.3333 14.5115 14.5114 13.3334 15.9999 13.3334Z" fill="#A098AE" />
              </svg>
            </button>
            <div className="flex items-center gap-4">
              <div>
                <p className="font-medium">{user?.name || "Joshua N."}</p>
                <p className="text-sm text-gray-500">Admin</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <img
                    src={user?.profile_picture || "https://res.cloudinary.com/dgxvuw8wd/image/upload/v1744385939/download_czu4ox.png"}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="allProfile">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/login" onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                    }}>
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-white p-4 my-4 counter rounded-md">
          <div className="flex items-center gap-4 p-[30px] bg-white rounded-2xl">
            <div className="w-12 h-12 flex items-center justify-center bg-[#4D44B5] bg-opacity-10 rounded-full">
              <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281721/Student_hunumx.svg" alt="students" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500">Students</p>
              <p className="text-3xl font-semibold">704</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-[30px] bg-white rounded-2xl">
            <div className="w-12 h-12 flex items-center justify-center bg-[#FB7D5B] bg-opacity-10 rounded-full">
              <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/teacher_mmxcpi.svg" alt="teachers" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500">Teachers</p>
              <p className="text-3xl font-semibold">754</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-[30px] bg-white rounded-2xl">
            <div className="w-12 h-12 flex items-center justify-center bg-[#FCC43E] bg-opacity-10 rounded-full">
              <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/Calendar_y5hl1n.svg" alt="events" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500">Events</p>
              <p className="text-3xl font-semibold">40</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-[30px] bg-white rounded-2xl">
            <div className="w-12 h-12 flex items-center justify-center bg-[#4D44B5] bg-opacity-10 rounded-full">
              <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281721/food_cp4exu.svg" alt="foods" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500">Records</p>
              <p className="text-3xl font-semibold">009</p>
            </div>
          </div>
        </div>

        {/* Calendar and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 lg:p-15 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4 school">School Calendar</h2>
            <div className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md w-full h-[200px] [&_.rdp-cell]:p-2 [&_.rdp-table]:space-y-4"
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-2 student-stat">
              <h2 className="text-lg font-semibold">Student Performance</h2>
              <div className="flex items-center gap-4 mt-2 lg:mt-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-[#FCC43E]"></div>
                  <span className="text-sm text-gray-500">This Week</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-[#FB7D5B]"></div>
                  <span className="text-sm text-gray-500">Last Week</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <BarChart
                width={Math.min(window.innerWidth - 40, 460)}
                height={260}
                data={chartData}
                margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                barCategoryGap="20%"
                barGap={7}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="red" fill="#FB7D5B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="yellow" fill="#FCC43E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachersDashboard;



