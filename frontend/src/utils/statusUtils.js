// Status utility functions for order status handling

/**
 * Convert backend OrderStatus enum to user-friendly display label
 * @param {string} status - Backend status (PLACED, PREPARING, READY, COMPLETED, CANCELLED)
 * @returns {string} Display label
 */
export const getStatusLabel = (status) => {
    const statusLabels = {
        PLACED: "Pending",
        PREPARING: "Preparing",
        READY: "Ready for Pickup",
        COMPLETED: "Completed",
        CANCELLED: "Cancelled",
    }
    return statusLabels[status] || status
}

/**
 * Get CSS color classes for status badge
 * @param {string} status - Backend status
 * @returns {string} Tailwind CSS classes
 */
export const getStatusColor = (status) => {
    const statusColors = {
        PLACED: "bg-yellow-100 text-yellow-800",
        PREPARING: "bg-blue-100 text-blue-800",
        READY: "bg-purple-100 text-purple-800",
        COMPLETED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
    }
    return statusColors[status] || "bg-gray-100 text-gray-800"
}

/**
 * Get icon for status
 * @param {string} status - Backend status
 * @returns {string} Emoji icon
 */
export const getStatusIcon = (status) => {
    const statusIcons = {
        PLACED: "🕐",
        PREPARING: "👨‍🍳",
        READY: "✅",
        COMPLETED: "🎉",
        CANCELLED: "❌",
    }
    return statusIcons[status] || "📦"
}

/**
 * Get all available order statuses
 * @returns {Array} Array of status values
 */
export const getAllStatuses = () => {
    return ["PLACED", "PREPARING", "READY", "COMPLETED", "CANCELLED"]
}

/**
 * Check if status is active (not completed or cancelled)
 * @param {string} status - Backend status
 * @returns {boolean}
 */
export const isActiveStatus = (status) => {
    return status !== "COMPLETED" && status !== "CANCELLED"
}
