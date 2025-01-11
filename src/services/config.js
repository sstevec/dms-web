import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // Base URL for all backend requests
});

// Request interceptor to inject the JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        // Add JWT token to headers for all requests except specified ones
        const token = localStorage.getItem('dms_jwt_token');
        if (token && !config.headers.skipAuth) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Response interceptor to handle unauthorized errors
axiosInstance.interceptors.response.use(
    (response) => {
        // Return the response if successful
        return response;
    },
    (error) => {
        // Check for unauthorized response
        if (error.response && error.response.status === 401) {
            // Redirect to login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
