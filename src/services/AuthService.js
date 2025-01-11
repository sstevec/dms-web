import axiosInstance from './config'; // Import the gateway URL

const API_URL = "/user-service/api/auth"

const AuthenticationService = {
    /**
     * Login user
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise<string>} - JWT token
     */
    login: async (email, password) => {
        try {
            const response = await axiosInstance.post(`${API_URL}/login`, null, {
                params: { email, password },
            });
            return response.data; // JWT token
        } catch (error) {
            console.error('Error during login:', error);
            throw error.response?.data || 'Login failed';
        }
    },

    /**
     * Register a paid account
     * @param {string} name - User's name
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise<string>} - User ID
     */
    register: async (name, email, password) => {
        try {
            const response = await axiosInstance.post(`${API_URL}/register`, null, {
                params: { name, email, password },
            });
            return response.data; // User ID
        } catch (error) {
            console.error('Error during registration:', error);
            throw error.response?.data || 'Registration failed';
        }
    },
};

export default AuthenticationService;
