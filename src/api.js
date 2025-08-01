import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create a custom axios instance
const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Your Django backend base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the Authorization header and handle token refresh
apiClient.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken) {
        // No access token, proceed with the original request (might be a login/register request)
        return config;
    }

    const user = jwtDecode(accessToken);
    const isExpired = user.exp * 1000 < Date.now(); // Check if token is expired

    if (!isExpired) {
        // Token is still valid, add it to the Authorization header and proceed
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        return config;
    }

    // Token is expired, try to refresh it
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
            refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        const newRefreshToken = response.data.refresh; // New refresh token might be returned

        // Update localStorage with the new tokens
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken || refreshToken); // Update if a new refresh token is provided

        // Update the Authorization header for the current request
        config.headers['Authorization'] = `Bearer ${newAccessToken}`;

        console.log('Tokens refreshed successfully.');
        return config;

    } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        // If token refresh fails, it means the refresh token is also invalid/expired.
        // Clear local storage and redirect to login page.
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Redirect to login

        // Reject the promise to prevent the original request from being sent with an invalid token
        return Promise.reject(refreshError);
    }
});

export default apiClient;