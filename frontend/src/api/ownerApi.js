import apiClient from './apiConfig';

/**
 * Restaurant Owner API Service
 */
const ownerApi = {
    /**
     * Create a new restaurant
     * @param {Object} restaurantData - Restaurant data
     * @returns {Promise} Created restaurant
     */
    createRestaurant: async (restaurantData) => {
        const response = await apiClient.post('/owner/restaurants', restaurantData);
        return response.data;
    },

    /**
     * Get owner's restaurants
     * @returns {Promise} List of restaurants
     */
    getMyRestaurants: async () => {
        const response = await apiClient.get('/owner/restaurants');
        return response.data;
    },

    /**
     * Add a dish to restaurant menu
     * @param {number} restaurantId - Restaurant ID
     * @param {Object} dishData - Dish data
     * @returns {Promise} Created dish
     */
    addDish: async (restaurantId, dishData) => {
        const response = await apiClient.post(`/owner/restaurants/${restaurantId}/dishes`, dishData);
        return response.data;
    },

    /**
     * Update a dish
     * @param {number} restaurantId - Restaurant ID
     * @param {number} dishId - Dish ID
     * @param {Object} dishData - Updated dish data
     * @returns {Promise} Updated dish
     */
    updateDish: async (restaurantId, dishId, dishData) => {
        const response = await apiClient.put(`/owner/restaurants/${restaurantId}/dishes/${dishId}`, dishData);
        return response.data;
    },

    /**
     * Delete a dish
     * @param {number} restaurantId - Restaurant ID
     * @param {number} dishId - Dish ID
     * @returns {Promise}
     */
    deleteDish: async (restaurantId, dishId) => {
        const response = await apiClient.delete(`/owner/restaurants/${restaurantId}/dishes/${dishId}`);
        return response.data;
    },

    /**
     * Get orders for a restaurant
     * @param {number} restaurantId - Restaurant ID
     * @returns {Promise} List of orders
     */
    getRestaurantOrders: async (restaurantId) => {
        const response = await apiClient.get(`/owner/restaurants/${restaurantId}/orders`);
        return response.data;
    },

    /**
     * Update order status
     * @param {number} orderId - Order ID
     * @param {string} status - New status (PLACED, PREPARING, READY, COMPLETED, CANCELLED)
     * @returns {Promise} Updated order
     */
    updateOrderStatus: async (orderId, status) => {
        const response = await apiClient.put(`/owner/orders/${orderId}/status`, null, {
            params: { status },
        });
        return response.data;
    },
};

export default ownerApi;
