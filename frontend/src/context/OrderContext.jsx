import { createContext, useContext, useState, useEffect } from "react"
import customerApi from "../api/customerApi"
import ownerApi from "../api/ownerApi"
import { useAuth } from "./AuthContext"

const OrderContext = createContext()

export const useOrders = () => {
    const context = useContext(OrderContext)
    if (!context) {
        throw new Error("useOrders must be used within OrderProvider")
    }
    return context
}

export const OrderProvider = ({ children }) => {
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Fetch orders based on user role
    const fetchOrders = async (restaurantId = null) => {
        if (!user) return

        setLoading(true)
        setError(null)
        try {
            let data
            if (user.role === "USER") {
                // Customer: fetch their orders
                data = await customerApi.getMyOrders()
            } else if (user.role === "OWNER" && restaurantId) {
                // Owner: fetch orders for specific restaurant
                data = await ownerApi.getRestaurantOrders(restaurantId)
            } else {
                // Admin or Owner without restaurant ID
                data = []
            }
            setOrders(data)
        } catch (err) {
            setError(err.message || "Failed to fetch orders")
            console.error("Error fetching orders:", err)
        } finally {
            setLoading(false)
        }
    }

    // Place a new order (Customer only)
    const placeOrder = async (restaurantId, items) => {
        try {
            const newOrder = await customerApi.placeOrder(restaurantId, items)
            setOrders(prev => [newOrder, ...prev])
            return newOrder
        } catch (err) {
            setError(err.message || "Failed to place order")
            throw err
        }
    }

    // Cancel an order (Customer only)
    const cancelOrder = async (orderId) => {
        try {
            const updatedOrder = await customerApi.cancelOrder(orderId)
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? updatedOrder : order
                )
            )
            return updatedOrder
        } catch (err) {
            setError(err.message || "Failed to cancel order")
            throw err
        }
    }

    // Update order status (Owner only)
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const updatedOrder = await ownerApi.updateOrderStatus(orderId, newStatus)
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? updatedOrder : order
                )
            )
            return updatedOrder
        } catch (err) {
            setError(err.message || "Failed to update order status")
            throw err
        }
    }

    // Get order statistics (calculated from local state)
    const getOrderStats = () => {
        const total = orders.length
        const placed = orders.filter((o) => o.status === "PLACED").length
        const preparing = orders.filter((o) => o.status === "PREPARING").length
        const ready = orders.filter((o) => o.status === "READY").length
        const completed = orders.filter((o) => o.status === "COMPLETED").length
        const cancelled = orders.filter((o) => o.status === "CANCELLED").length

        // Calculate total revenue from completed orders
        const totalRevenue = orders
            .filter((o) => o.status === "COMPLETED")
            .reduce((sum, order) => {
                // Calculate order total from items
                const orderTotal = order.items?.reduce((itemSum, item) =>
                    itemSum + (item.dish?.price || 0) * item.quantity, 0
                ) || 0
                return sum + orderTotal
            }, 0)

        return {
            total,
            placed,
            preparing,
            ready,
            completed,
            cancelled,
            totalRevenue,
        }
    }

    // Load orders when user changes
    useEffect(() => {
        if (user && user.role === "USER") {
            fetchOrders()
        } else {
            setOrders([])
        }
    }, [user])

    const value = {
        orders,
        loading,
        error,
        fetchOrders,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        getOrderStats,
    }

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}
