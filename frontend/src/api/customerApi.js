import apiClient from './apiConfig';

/**
 * Customer API Service
 */
const customerApi = {
    /**
     * Get all restaurants
     * @returns {Promise} List of restaurants
     */
    getRestaurants: async () => {
        const response = await apiClient.get('/customer/restaurants');
        return response.data;
    },

    /**
     * Get menu for a specific restaurant
     * @param {number} restaurantId - Restaurant ID
     * @returns {Promise} List of dishes
     */
    getRestaurantMenu: async (restaurantId) => {
        const response = await apiClient.get(`/customer/restaurants/${restaurantId}/menu`);
        return response.data;
    },

    /**
     * Place an order
     * @param {number} restaurantId - Restaurant ID
     * @param {Array} items - Order items [{dish: {id}, quantity}]
     * @returns {Promise} Created order
     */
    placeOrder: async (restaurantId, items) => {
        const response = await apiClient.post(`/customer/restaurants/${restaurantId}/orders`, items);
        return response.data;
    },

    /**
     * Get customer's orders
     * @returns {Promise} List of orders
     */
    getMyOrders: async () => {
        const response = await apiClient.get('/customer/orders');
        return response.data;
    },

    /**
     * Cancel an order
     * @param {number} orderId - Order ID
     * @returns {Promise} Updated order
     */
    cancelOrder: async (orderId) => {
        const response = await apiClient.delete(`/customer/orders/${orderId}`);
        return response.data;
    },
};

export default customerApi;
