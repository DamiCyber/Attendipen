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
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl font-semibold text-gray-600">Loading parents...</div>
            </div>
        );
    }

    if (error) return <div className="error">{error}</div>;
    if (!parents || parents.length === 0) return <div className="error">No parents found</div>;

    return (
      

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
    );
};

export default ListOfParents;
