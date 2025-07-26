// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState(''); // For password confirmation
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setMessage('');     // Clear previous messages
    setError('');       // Clear previous errors

    if (password !== password2) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/register/', {
        email,
        password,
        password2 // Make sure your Django serializer expects password2
      });
      setMessage('Registration successful! Please login.');
      setEmail('');
      setPassword('');
      setPassword2('');
      console.log('Registration response:', response.data);
    } catch (err) {
      console.error('Registration error:', err.response ? err.response.data : err);
      if (err.response && err.response.data) {
        // Handle specific errors from Django backend
        if (err.response.data.email) {
          setError(`Email: ${err.response.data.email.join(', ')}`);
        } else if (err.response.data.password) {
          setError(`Password: ${err.response.data.password.join(', ')}`);
        } else if (err.response.data.password2) {
          setError(`Password confirmation: ${err.response.data.password2.join(', ')}`);
        } else if (err.response.data.detail) {
          setError(err.response.data.detail);
        } else {
          setError('Registration failed. Please check your details.');
        }
      } else {
        setError('An unexpected error occurred during registration.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-heading">Register Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group"> {/* This was correct already, ensuring it stays this way */}
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group"> {/* This was correct already, ensuring it stays this way */}
          <label>Confirm Password:</label>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="form-button">Register</button>
      </form>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
}

export default Register;