import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListOfParents = () => {
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [profilePictures, setProfilePictures] = useState({});

    useEffect(() => {
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

    const fetchProfilePicture = async (parentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `https://attendipen-d65abecaffe3.herokuapp.com/parents/${parentId}?type=profile_picture`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    responseType: 'blob'
                }
            );
            const imageUrl = URL.createObjectURL(response.data);
            setProfilePictures(prev => ({
                ...prev,
                [parentId]: imageUrl
            }));
        } catch (err) {
            console.error(`Error fetching profile picture for parent ${parentId}:`, err);
        }
    };

    useEffect(() => {
        const fetchParents = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://attendipen-d65abecaffe3.herokuapp.com/parents/all?type=object', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const parentsData = Array.isArray(response.data)
                    ? response.data
                    : [response.data];

                setParents(parentsData);
                
                // Fetch profile pictures for each parent
                parentsData.forEach(parent => {
                    if (parent.id) {
                        fetchProfilePicture(parent.id);
                    }
                });

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch parents');
                setLoading(false);
                console.error('Error fetching parents:', err);
            }
        };

        fetchParents();

        // Cleanup function to revoke object URLs
        return () => {
            Object.values(profilePictures).forEach(url => {
                URL.revokeObjectURL(url);
            });
        };
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen bg-[#F9F9F9]">
                <div className="flex-1 p-8 mt-7 main-content">
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-[#4D44B5] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[#4D44B5] font-medium">Loading Parents...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) return <div className="error">{error}</div>;
    if (!parents || parents.length === 0) return <div className="error">No parents found</div>;

    return (
        <div className="flex h-screen bg-[#F9F9F9]">
            {/* Sidebar */}
            <div className="w-64 bg-[#4D44B5] text-white sidebar">
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
                            <li>
                                <Link
                                    to="/Dashboard"
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <img
                                        src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/home-2_wwzqrg.png"
                                        alt="dashboard"
                                        className="w-5 h-5 flex-shrink-0"
                                    />
                                    <span className="text-sm font-medium">Dashboard</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/Teachers"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-white/10"
                                >
                                    <img
                                        src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/teacher_mmxcpi.svg"
                                        alt="teachers"
                                        className="w-5 h-5 flex-shrink-0"
                                    />
                                    <span className="text-sm font-medium">Teachers</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/Student"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-white/10"
                                >
                                    <img
                                        src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281721/Student_hunumx.svg"
                                        alt="students"
                                        className="w-5 h-5 flex-shrink-0"
                                    />
                                    <span className="text-sm font-medium">Students</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/CreateClass"
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.33337 9.05332V10.5C1.33337 13.8333 2.66671 15.1666 6.00004 15.1666H10C13.3334 15.1666 14.6667 13.8333 14.6667 10.5V6.49998C14.6667 3.16665 13.3334 1.83331 10 1.83331H6.00004C2.66671 1.83331 1.33337 3.16665 1.33337 6.49998" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.74003 7.93335H4.97337C4.55337 7.93335 4.21338 8.27332 4.21338 8.69332V12.1066H6.74003V7.93335V7.93335Z" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8.50673 4.89996H7.49339C7.07339 4.89996 6.7334 5.23997 6.7334 5.65997V12.1H9.26007V5.65997C9.26007 5.23997 8.92673 4.89996 8.50673 4.89996Z" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M11.0334 9.06665H9.26672V12.1H11.7934V9.82666C11.7867 9.40666 11.4467 9.06665 11.0334 9.06665Z" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Create Class</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/List"
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 nnn33336H2.00004C1.36004 8.33336 0.833374 7.8067 0.833374 7.1667V4.95336C0.833374 4.50002 1.14669 4.04003 1.56669 3.87336L7.56669 1.47338C7.82002 1.37338 8.18006 1.37338 8.43339 1.47338L14.4334 3.87336C14.8534 4.04003 15.1667 4.50669 15.1667 4.95336V7.1667C15.1667 7.8067 14.64 8.33336 14 8.33336ZM8.00004 2.39338C7.97337 2.39338 7.94672 2.39335 7.93339 2.40001L1.94002 4.80004C1.90002 4.82004 1.83337 4.90669 1.83337 4.95336V7.1667C1.83337 7.26003 1.90671 7.33336 2.00004 7.33336H14C14.0934 7.33336 14.1667 7.26003 14.1667 7.1667V4.95336C14.1667 4.90669 14.1067 4.82004 14.0601 4.80004L8.06006 2.40001C8.04673 2.39335 8.02671 2.39338 8.00004 2.39338Z" fill="white" />
                                        <path d="M14.6667 15.6667H1.33337C1.06004 15.6667 0.833374 15.44 0.833374 15.1667V13.1667C0.833374 12.5267 1.36004 12 2.00004 12H14C14.64 12 15.1667 12.5267 15.1667 13.1667V15.1667C15.1667 15.44 14.94 15.6667 14.6667 15.6667ZM1.83337 14.6667H14.1667V13.1667C14.1667 13.0733 14.0934 13 14 13H2.00004C1.90671 13 1.83337 13.0733 1.83337 13.1667V14.6667Z" fill="white" />
                                    </svg>
                                    <span>Class List</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/Setting"
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg"
                                >
                                    <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281722/setting-2_nxazfr.svg" alt="settings" className="w-5 h-5" />
                                    <span>Attendance Setting</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/view"
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.33337 9.05332V10.5C1.33337 13.8333 2.66671 15.1666 6.00004 15.1666H10C13.3334 15.1666 14.6667 13.8333 14.6667 10.5V6.49998C14.6667 3.16665 13.3334 1.83331 10 1.83331H6.00004C2.66671 1.83331 1.33337 3.16665 1.33337 6.49998" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.74003 7.93335H4.97337C4.55337 7.93335 4.21338 8.27332 4.21338 8.69332V12.1066H6.74003V7.93335V7.93335Z" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8.50673 4.89996H7.49339C7.07339 4.89996 6.7334 5.23997 6.7334 5.65997V12.1H9.26007V5.65997C9.26007 5.23997 8.92673 4.89996 8.50673 4.89996Z" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M11.0334 9.06665H9.26672V12.1H11.7934V9.82666C11.7867 9.40666 11.4467 9.06665 11.0334 9.06665Z" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>View Attendance</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/AssignTeacher"
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg"
                                >
                                    <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281723/teacher_mmxcpi.svg" alt="teachers" className="w-5 h-5" />
                                    <span>Assign Teacher</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/AssignStudents"
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg"
                                >
                                    <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281721/Student_hunumx.svg" alt="students" className="w-5 h-5" />
                                    <span>Assign Student</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/ListOfParent"
                                    className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg"
                                >
                                    <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281721/food_cp4exu.svg" alt="settings" className="w-5 h-5" />
                                    <span>Parent List</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/Profile"
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg"
                                >
                                    <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281722/setting-2_nxazfr.svg" alt="settings" className="w-5 h-5" />
                                    <span>Setting and profile</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 mt-7 main-content">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="description">
                        <h1 className="text-2xl font-semibold text-[#4D44B5]">Parent</h1>
                    </div>

                    <div className="flex items-center gap-9 control">
                        <button className="p-2 hover:bg-gray-100 rounded-lg bg-white control-btn" width="38" height="38">
                            <img src="https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281722/bell_muudfk.svg" alt="notifications" className="w-6 h-6" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg bg-white control-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 32" fill="none">
                                <path d="M12.2629 2.66669L11.4166 6.46617C10.9352 6.6978 10.4751 6.9646 10.0338 7.26565L6.32023 6.09637L2.58325 12.5703L5.39836 15.1485C5.28837 15.9648 5.33819 16.3672 5.39836 16.8516L2.58325 19.4297L6.32023 25.9037L10.0338 24.7344C10.4751 25.0354 10.9352 25.3022 11.4166 25.5339L12.2629 29.3334H19.7369L20.5833 25.5339C21.0646 25.3022 21.5248 25.0354 21.9661 24.7344L25.6796 25.9037L29.4166 19.4297L26.6015 16.8516C26.6245 16.5682 26.6663 16.2846 26.6666 16C26.6677 15.7069 26.6215 15.4108 26.6015 15.1485L29.4166 12.5703L25.6796 6.09637L21.9661 7.26565C21.5248 6.9646 21.0646 6.6978 20.5833 6.46617L19.7369 2.66669H12.2629ZM14.4036 5.33335H17.5963L18.2551 8.29169L18.9166 8.5521C19.6648 8.84513 20.3643 9.24847 20.9921 9.75002L21.5494 10.1927L24.44 9.28387L26.0364 12.0495L23.802 14.099L23.9088 14.8021C24.0344 15.5797 24.01 16.4746 23.9088 17.1979L23.802 17.9011L26.0364 19.9505L24.44 22.7162L21.5494 21.8073L20.9921 22.25C20.3643 22.7516 19.6648 23.1549 18.9166 23.4479L18.2551 23.7084L17.5963 26.6667H14.4036L13.7447 23.7084L13.0833 23.4479C12.335 23.1549 11.6356 22.7516 11.0077 22.25L10.4504 21.8073L7.55981 22.7162L5.96346 19.9505L8.19783 17.9011L8.09106 17.1979C7.96083 16.4047 7.98083 15.4967 8.09106 14.8021L8.19783 14.099L5.96346 12.0495L7.55981 9.28387L10.4504 10.1927L11.0077 9.75002C11.6356 9.24847 12.335 8.84513 13.0833 8.5521L13.7447 8.29169L14.4036 5.33335ZM15.9999 10.6667C13.0702 10.6667 10.6666 13.0703 10.6666 16C10.6666 18.9297 13.0702 21.3334 15.9999 21.3334C18.9296 21.3334 21.3333 18.9297 21.3333 16C21.3333 13.0703 18.9296 10.6667 15.9999 10.6667ZM15.9999 13.3334C17.4885 13.3334 18.6666 14.5115 18.6666 16C18.6666 17.4886 17.4885 18.6667 15.9999 18.6667C14.5114 18.6667 13.3333 17.4886 13.3333 16C13.3333 14.5115 14.5114 13.3334 15.9999 13.3334Z" fill="#A098AE" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="font-medium">{user?.name || "Loading..."}</p>
                                <p className="text-sm text-gray-500">Admin</p>
                            </div>
                            <div className="relative">
                                <img
                                    src={user?.profile_picture || "https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281722/bell_muudfk.svg"}
                                    alt="profile"
                                    className="w-10 h-10 rounded-full cursor-pointer"
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Profile
                                    </Link>
                                    <Link
                                        to="/login"
                                        onClick={() => {
                                            localStorage.removeItem("token");
                                            localStorage.removeItem("user");
                                        }}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="parents-container wider">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {parents.map((parent) => (
                            <div
                                key={parent.id}
                                className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center space-y-4"
                            >
                                {/* Profile Picture */}
                                <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300">
                                    {profilePictures[parent.id] ? (
                                        <img
                                            src={profilePictures[parent.id]}
                                            alt={parent.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://res.cloudinary.com/dgxvuw8wd/image/upload/v1736281722/bell_muudfk.svg";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-500">
                                            {parent.name?.charAt(0).toUpperCase() || 'P'}
                                        </div>
                                    )}
                                </div>

                                {/* Parent Info */}
                                <div className="text-center space-y-1">
                                    <h3 className="text-lg font-semibold text-gray-800">{parent.name || 'Unknown Parent'}</h3>
                                    <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {parent.email || 'N/A'}</p>
                                    <p className="text-sm text-gray-600"><span className="font-medium">Phone:</span> {parent.phone_number || 'N/A'}</p>
                                    <p className="text-sm text-gray-600"><span className="font-medium">Address:</span> {parent.address || 'N/A'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListOfParents;
