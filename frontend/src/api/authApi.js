import apiClient, { setAuthCredentials, clearAuthCredentials } from './apiConfig';

/**
 * Authentication API Service
 */
const authApi = {
    /**
     * Login user
     * @param {string} username - Username
     * @param {string} password - Password
     * @returns {Promise} User data with id, username, and role
     */
    login: async (username, password) => {
        try {
            const response = await apiClient.post('/auth/login', {
                username,
                password,
            });

            // Store credentials for future requests
            setAuthCredentials(username, password);

            return response.data;
        } catch (error) {
            clearAuthCredentials();
            throw error;
        }
    },

    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @param {string} userData.username - Username
     * @param {string} userData.password - Password
     * @param {string} userData.role - Role (USER, OWNER, ADMIN)
     * @returns {Promise} Created user data
     */
    register: async (userData) => {
        try {
            const response = await apiClient.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Logout user (clear credentials)
     */
    logout: () => {
        clearAuthCredentials();
    },
};

export default authApi;
