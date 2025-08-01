import React, { useState, useEffect } from 'react';
import apiClient from './api';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    // State for form fields
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // The apiClient interceptor will automatically add the token and refresh it if needed
                const response = await apiClient.get('/accounts/profile/');
                
                setProfile(response.data);
                // Populate form fields with fetched data
                setPhoneNumber(response.data.phone_number || '');
                setAddress(response.data.address || '');
                setCity(response.data.city || '');
                setState(response.data.state || '');
                setZipCode(response.data.zip_code || '');
                // The 'date' input type expects a YYYY-MM-DD format
                setDateOfBirth(response.data.date_of_birth || '');
                
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setError('Failed to fetch profile. Please try again.');
                setLoading(false);
                // If a 401 Unauthorized error occurs, the interceptor should handle it
                // by redirecting to login. This check is a good fallback.
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const formData = {
            phone_number: phoneNumber,
            address: address,
            city: city,
            state: state,
            zip_code: zipCode,
            date_of_birth: dateOfBirth, // Ensure date format matches Django's expected format (YYYY-MM-DD)
        };
        
        try {
            // The apiClient interceptor handles the Authorization header automatically.
            // Also, we can send the data as a JSON object instead of FormData unless we need a file upload.
            const response = await apiClient.patch('/accounts/profile/', formData);

            setProfile(response.data);
            setMessage('Profile updated successfully!');
            setLoading(false);
            console.log('Profile update response:', response.data);
        } catch (err) {
            console.error('Failed to update profile:', err.response ? err.response.data : err);
            setError('Failed to update profile. Please check your input.');
            setLoading(false);
            if (err.response && err.response.data) {
                const errorMessages = Object.values(err.response.data).flat().join(' ');
                setError(`Failed to update profile: ${errorMessages}`);
            }
        }
    };

    if (loading) {
        return <div className="loading-container">Loading profile...</div>;
    }

    if (error && !profile) {
        return <div className="error-container">{error}</div>;
    }
    
    // Note: The 'profile' object might be null if fetching failed, so we check for it.
    if (!profile) {
        return <div className="error-container">No profile data available.</div>;
    }

    return (
        <div className="profile-container">
            <h2 className="profile-heading">User Profile</h2>
            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={profile.email || ''}
                        readOnly
                        className="form-input read-only"
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>City:</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>State:</label>
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Zip Code:</label>
                    <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Date of Birth:</label>
                    <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="form-input"
                    />
                </div>
                <button type="submit" className="form-button">Update Profile</button>
            </form>
        </div>
    );
}

export default Profile;