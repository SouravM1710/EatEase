// Role utility functions for user role handling

/**
 * Convert backend Role enum to user-friendly display label
 * @param {string} role - Backend role (USER, OWNER, ADMIN)
 * @returns {string} Display label
 */
export const getRoleLabel = (role) => {
    const roleLabels = {
        USER: "Customer",
        OWNER: "Restaurant Owner",
        ADMIN: "Administrator",
    }
    return roleLabels[role] || role
}

/**
 * Check if user is a restaurant owner
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const isOwner = (user) => {
    return user && user.role === "OWNER"
}

/**
 * Check if user is a customer
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const isCustomer = (user) => {
    return user && user.role === "USER"
}

/**
 * Check if user is an admin
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const isAdmin = (user) => {
    return user && user.role === "ADMIN"
}

/**
 * Get all available roles
 * @returns {Array} Array of role values
 */
export const getAllRoles = () => {
    return ["USER", "OWNER", "ADMIN"]
}

/**
 * Get role icon
 * @param {string} role - Backend role
 * @returns {string} Emoji icon
 */
export const getRoleIcon = (role) => {
    const roleIcons = {
        USER: "👤",
        OWNER: "🏪",
        ADMIN: "👨‍💼",
    }
    return roleIcons[role] || "👤"
}
