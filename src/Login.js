import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) { // onLoginSuccess prop will be used later
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/api/login/', {
        email,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);    // Store access token
      localStorage.setItem('refreshToken', refresh); // Store refresh token
      setMessage('Login successful!');
      setEmail('');
      setPassword('');
      console.log('Login successful:', response.data);

      if (onLoginSuccess) {
        onLoginSuccess(); // Notify parent component (App.js) about successful login
      }

    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    }
  };

  return (
  <div className="auth-container"> {/* Changed from inline style */}
    <h2 className="auth-heading">Login to Your Account</h2> {/* Changed from inline style */}
    <form onSubmit={handleSubmit} className="auth-form"> {/* Changed from inline style */}
      <div className="form-group"> {/* Changed from inline style */}
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="form-input"
        />
      </div>
      <button type="submit" className="form-button login-button">Login</button> {/* Changed from inline style, added login-button */}
    </form>
    {message && <p className="message success">{message}</p>}
    {error && <p className="message error">{error}</p>}
  </div>
);
}

export default Login;