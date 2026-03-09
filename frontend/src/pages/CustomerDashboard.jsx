import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { useOrders } from "../context/OrderContext"
import DashboardLayout from "../components/DashboardLayout"
import StatsCard from "../components/StatsCard"
import { getStatusLabel, getStatusColor } from "../utils/statusUtils"

const CustomerDashboard = () => {
    const [activeTab, setActiveTab] = useState("orders")
    const { user } = useAuth()
    const { cartItems } = useCart()
    const { orders, loading, error } = useOrders()

    // All orders are already filtered for current customer by OrderContext

    const navItems = [
        { id: "orders", label: "My Orders", icon: "📦" },
        { id: "favorites", label: "Favorites", icon: "❤️" },
        { id: "profile", label: "Profile", icon: "👤" },
    ]

    // Calculate total spent from order items
    const totalSpent = orders.reduce((sum, order) => {
        const orderTotal = order.items?.reduce((itemSum, item) =>
            itemSum + (item.dish?.price || 0) * item.quantity, 0
        ) || 0
        return sum + orderTotal
    }, 0)

    // My Orders Section
    const MyOrdersSection = () => (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Orders
            </h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    icon="📦"
                    title="Total Orders"
                    value={orders.length}
                    gradient="from-blue-500 to-cyan-600"
                />
                <StatsCard
                    icon="💰"
                    title="Total Spent"
                    value={`₹${totalSpent.toFixed(2)}`}
                    gradient="from-green-500 to-emerald-600"
                />
                <StatsCard
                    icon="🛒"
                    title="Cart Items"
                    value={cartItems.length}
                    gradient="from-purple-500 to-pink-600"
                />
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
                    <div className="text-6xl mb-4">⏳</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Loading your orders...
                    </h3>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 shadow-lg">
                    <div className="text-4xl mb-2">⚠️</div>
                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
                        Error loading orders
                    </h3>
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}

            {/* Orders List */}
            {!loading && !error && (
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
                            <div className="text-6xl mb-4">🍽️</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No orders yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Start ordering from your favorite restaurants!
                            </p>
                        </div>
                    ) : (
                        orders.map((order) => {
                            const orderTotal = order.items?.reduce((sum, item) =>
                                sum + (item.dish?.price || 0) * item.quantity, 0
                            ) || 0

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                {order.restaurant?.name || "Restaurant"}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Order #{order.id} • {new Date(order.orderDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                                        >
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>

                                    {/* Items */}
                                    <div className="space-y-2 mb-4">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {item.quantity}x {item.dish?.name || "Item"}
                                                </span>
                                                <span className="text-gray-900 dark:text-white font-medium">
                                                    ₹{((item.dish?.price || 0) * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                            Total
                                        </span>
                                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                            ₹{orderTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div >
            )}
        </div >
    )

    // Favorites Section
    const FavoritesSection = () => (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Favorite Restaurants
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No favorites yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Add restaurants to your favorites for quick access!
                </p>
            </div>
        </div>
    )

    // Profile Section
    const ProfileSection = () => (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Profile
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-4xl font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {user.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={user.name}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user.email}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone
                        </label>
                        <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                        Update Profile
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <DashboardLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navItems={navItems}
            title="My Dashboard"
        >
            {activeTab === "orders" && <MyOrdersSection />}
            {activeTab === "favorites" && <FavoritesSection />}
            {activeTab === "profile" && <ProfileSection />}
        </DashboardLayout>
    )
}

export default CustomerDashboard
