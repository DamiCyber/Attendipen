import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListOfParents = () => {
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParents = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://attendipen-d65abecaffe3.herokuapp.com/parents/all?type=object', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                // Check if response.data is an object and convert it to array if needed
                const parentsData = Array.isArray(response.data) 
                    ? response.data 
                    : [response.data];
                
                setParents(parentsData);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch parents');
                setLoading(false);
                console.error('Error fetching parents:', err);
            }
        };

        fetchParents();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!parents || parents.length === 0) return <div className="error">No parents found</div>;

    return (
        <div className="parents-container">
            <h2>List of Parents</h2>
            <div className="parents-grid">
                {parents.map((parent) => (
                    <div key={parent.id} className="parent-card">
                        <div className="parent-image">
                            {parent.profile_picture ? (
                                <img src={parent.profile_picture} alt={parent.name} />
                            ) : (
                                <div className="default-avatar">
                                    {parent.name?.charAt(0) || 'P'}
                                </div>
                            )}
                        </div>
                        <div className="parent-info">
                            <h3>{parent.name || 'Unknown Parent'}</h3>
                            <p>Email: {parent.email || 'N/A'}</p>
                            <p>Phone: {parent.phone || 'N/A'}</p>
                            <p>Address: {parent.address || 'N/A'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListOfParents;
