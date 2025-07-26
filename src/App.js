import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductList from './ProductList';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import ProtectedRoute from './ProtectedRoute';
import ProductDetail from './ProductDetail';
import './App.css';
import Profile from './Profile'; // Add this line

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    alert('Login successful! Welcome.');
    navigate('/products');
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await axios.post('http://127.0.0.1:8000/accounts/api/token/blacklist/', {
          refresh: refreshToken
        });
        console.log('Refresh token blacklisted successfully.');
      } catch (error) {
        console.error('Error blacklisting refresh token:', error.response ? error.response.data : error);
        // Even if blacklisting fails, clear local storage tokens to log out client-side
      }
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    alert('You have been logged out.');
    navigate('/login'); // Navigate back to login page after logout
  };

  return (
    <div className="App">
      <nav className="navbar"> {/* Removed style attribute */}
        <ul className="navbar-list"> {/* Changed to className */}
          <li className="navbar-item"> {/* Changed to className */}
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          {!isAuthenticated ? (
          <>
            <li className="navbar-item">
              <Link to="/register" className="navbar-link">Register</Link>
            </li>
            <li className="navbar-item">
              <Link to="/login" className="navbar-link">Login</Link>
            </li>
          </>
        ) : (
          <>
            <li className="navbar-item"> {/* Add this new nav item */}
              <Link to="/profile" className="navbar-link">Profile</Link>
            </li>
            <li className="navbar-item">
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </li>
          </>
        )}
        </ul>
      </nav>

      <div className="content">
        <Routes>
              <Route path="/" element={<Home />} />
              {/* Protected Routes */}
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <ProductList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              />
              {/* New Protected Route for Profile */}
              {/* Corrected line: path and element are now INSIDE the Route tag */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            </Routes>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;