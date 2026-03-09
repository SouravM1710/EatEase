import apiClient from './apiConfig';

/**
 * Admin API Service
 */
const adminApi = {
    /**
     * Get all users
     * @returns {Promise} List of users
     */
    getAllUsers: async () => {
        const response = await apiClient.get('/admin/users');
        return response.data;
    },

    /**
     * Get user by ID
     * @param {number} userId - User ID
     * @returns {Promise} User data
     */
    getUserById: async (userId) => {
        const response = await apiClient.get(`/admin/users/${userId}`);
        return response.data;
    },

    /**
     * Get all restaurants
     * @returns {Promise} List of restaurants
     */
    getAllRestaurants: async () => {
        const response = await apiClient.get('/admin/restaurants');
        return response.data;
    },

    /**
     * Delete a restaurant
     * @param {number} restaurantId - Restaurant ID
     * @returns {Promise}
     */
    deleteRestaurant: async (restaurantId) => {
        const response = await apiClient.delete(`/admin/restaurants/${restaurantId}`);
        return response.data;
    },

    /**
     * Get all orders
     * @returns {Promise} List of orders
     */
    getAllOrders: async () => {
        const response = await apiClient.get('/admin/orders');
        return response.data;
    },

    /**
     * Get order by ID
     * @param {number} orderId - Order ID
     * @returns {Promise} Order data
     */
    getOrderById: async (orderId) => {
        const response = await apiClient.get(`/admin/orders/${orderId}`);
        return response.data;
    },
};

export default adminApi;
