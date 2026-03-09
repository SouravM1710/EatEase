import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Store credentials in memory (will be set after login)
let authCredentials = null;

// Set authentication credentials
export const setAuthCredentials = (username, password) => {
    authCredentials = {
        username,
        password,
    };
};

// Clear authentication credentials
export const clearAuthCredentials = () => {
    authCredentials = null;
};

// Get current credentials
export const getAuthCredentials = () => {
    return authCredentials;
};

// Request interceptor to add Basic Auth header
apiClient.interceptors.request.use(
    (config) => {
        if (authCredentials) {
            // Create Basic Auth header
            const token = btoa(`${authCredentials.username}:${authCredentials.password}`);
            config.headers.Authorization = `Basic ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            if (status === 401) {
                // Unauthorized - clear credentials
                clearAuthCredentials();
                console.error('Authentication failed. Please login again.');
            } else if (status === 403) {
                console.error('Access forbidden. You do not have permission.');
            } else if (status === 404) {
                console.error('Resource not found.');
            } else if (status >= 500) {
                console.error('Server error. Please try again later.');
            }

            // Return error with message
            return Promise.reject({
                status,
                message: data?.message || data || 'An error occurred',
            });
        } else if (error.request) {
            // Request made but no response received
            console.error('Network error. Please check your connection.');
            return Promise.reject({
                status: 0,
                message: 'Network error. Please check your connection.',
            });
        } else {
            // Something else happened
            console.error('Error:', error.message);
            return Promise.reject({
                status: 0,
                message: error.message,
            });
        }
    }
);

export default apiClient;
export { API_BASE_URL };
