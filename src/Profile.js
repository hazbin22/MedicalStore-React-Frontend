import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    // const [profilePicture, setProfilePicture] = useState(null); // For handling file uploads later

    useEffect(() => {
        const fetchProfile = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://127.0.0.1:8000/accounts/profile/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setProfile(response.data);
                // Populate form fields with fetched data
                setPhoneNumber(response.data.phone_number || '');
                setAddress(response.data.address || '');
                setCity(response.data.city || '');
                setState(response.data.state || '');
                setZipCode(response.data.zip_code || '');
                setDateOfBirth(response.data.date_of_birth || ''); // Dates might need formatting
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setError('Failed to fetch profile. Please try again.');
                setLoading(false);
                // Optionally, navigate to login if 401 Unauthorized
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
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

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/login');
            return;
        }

        const formData = new FormData();
        formData.append('phone_number', phoneNumber);
        formData.append('address', address);
        formData.append('city', city);
        formData.append('state', state);
        formData.append('zip_code', zipCode);
        formData.append('date_of_birth', dateOfBirth); // Ensure date format matches Django's expected format (YYYY-MM-DD)
        // if (profilePicture) {
        //     formData.append('profile_picture', profilePicture);
        // }

        try {
            const response = await axios.patch('http://127.0.0.1:8000/accounts/profile/', formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data' // Important for file uploads, even without files, it's safer for FormData
                },
            });
            setProfile(response.data);
            setMessage('Profile updated successfully!');
            setLoading(false);
            console.log('Profile update response:', response.data);
        } catch (err) {
            console.error('Failed to update profile:', err.response ? err.response.data : err);
            setError('Failed to update profile. Please check your input.');
            setLoading(false);
            if (err.response && err.response.data) {
                // Display specific validation errors from Django
                const errorMessages = Object.values(err.response.data).flat().join(' ');
                setError(`Failed to update profile: ${errorMessages}`);
            }
        }
    };

    // If you decide to add profile picture upload
    // const handleFileChange = (e) => {
    //     setProfilePicture(e.target.files[0]);
    // };

    if (loading) {
        return <div className="loading-container">Loading profile...</div>;
    }

    if (error && !profile) { // Show error if profile could not be fetched initially
        return <div className="error-container">{error}</div>;
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
                        value={profile.email || ''} // Display email from fetched profile
                        readOnly // Email should be read-only here
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
                {/* If adding profile picture upload */}
                {/* <div className="form-group">
                    <label>Profile Picture:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="form-input"
                    />
                    {profile.profile_picture && (
                        <img src={profile.profile_picture} alt="Profile" className="profile-picture-preview" />
                    )}
                </div> */}
                <button type="submit" className="form-button">Update Profile</button>
            </form>
        </div>
    );
}

export default Profile;