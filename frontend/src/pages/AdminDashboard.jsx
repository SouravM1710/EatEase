import { useState } from "react"
import { useOrders } from "../context/OrderContext"
import DashboardLayout from "../components/DashboardLayout"
import StatsCard from "../components/StatsCard"
import restaurants from "../data/restaurants"
import users from "../data/users"

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview")
    const { orders, updateOrderStatus, getOrderStats } = useOrders()
    const stats = getOrderStats()

    const navItems = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "restaurants", label: "Restaurants", icon: "🍽️" },
        { id: "orders", label: "Orders", icon: "📦" },
        { id: "users", label: "Users", icon: "👥" },
        { id: "menu", label: "Menu", icon: "📋" },
    ]

    // Overview Section
    const OverviewSection = () => (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard Overview
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon="💰"
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    change="+12.5%"
                    changeType="up"
                    gradient="from-green-500 to-emerald-600"
                />
                <StatsCard
                    icon="📦"
                    title="Total Orders"
                    value={stats.total}
                    change="+8.2%"
                    changeType="up"
                    gradient="from-blue-500 to-cyan-600"
                />
                <StatsCard
                    icon="🍽️"
                    title="Restaurants"
                    value={restaurants.length}
                    change="+2"
                    changeType="up"
                    gradient="from-purple-500 to-pink-600"
                />
                <StatsCard
                    icon="👥"
                    title="Active Users"
                    value={users.filter((u) => u.status === "active").length}
                    change="+15.3%"
                    changeType="up"
                    gradient="from-orange-500 to-red-600"
                />
            </div>

            {/* Order Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                        </div>
                        <div className="text-3xl">⏳</div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Preparing</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.preparing}</p>
                        </div>
                        <div className="text-3xl">👨‍🍳</div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.delivered}</p>
                        </div>
                        <div className="text-3xl">✅</div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Cancelled</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.cancelled}</p>
                        </div>
                        <div className="text-3xl">❌</div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Recent Orders
                </h2>
                <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                        <div
                            key={order.id}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {order.id} - {order.customerName}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {order.restaurant} • ₹{order.total}
                                </p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "delivered"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : order.status === "preparing"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                        : order.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                            : order.status === "cancelled"
                                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                    }`}
                            >
                                {order.status.replace("_", " ").toUpperCase()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    // Restaurants Section
    const RestaurantsSection = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Restaurants
                </h1>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105">
                    + Add Restaurant
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.id}
                        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {restaurant.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                {restaurant.cuisine}
                            </p>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    ⭐ {restaurant.rating}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {restaurant.time}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                    Edit
                                </button>
                                <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    // Orders Section
    const OrdersSection = () => (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Order Management
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Restaurant</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                        {order.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {order.customerName}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {order.customerEmail}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        {order.restaurant}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        ₹{order.total}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${order.status === "delivered"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : order.status === "preparing"
                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                    : order.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                        : order.status === "cancelled"
                                                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                            : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                                }`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="preparing">Preparing</option>
                                            <option value="out_for_delivery">Out for Delivery</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

    // Users Section
    const UsersSection = () => (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                User Management
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Join Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Orders</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {user.phone}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {user.joinDate}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        {user.totalOrders}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === "active"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                }`}
                                        >
                                            {user.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

    // Menu Section
    const MenuSection = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Menu Management
                </h1>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105">
                    + Add Menu Item
                </button>
            </div>

            {restaurants.map((restaurant) => (
                <div
                    key={restaurant.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {restaurant.name}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {restaurant.menu.map((item) => (
                            <div
                                key={item.id}
                                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {item.name}
                                    </h3>
                                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                        ₹{item.price}
                                    </span>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button className="flex-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                                        Edit
                                    </button>
                                    <button className="flex-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )

    return (
        <DashboardLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navItems={navItems}
            title="Admin Dashboard"
        >
            {activeTab === "overview" && <OverviewSection />}
            {activeTab === "restaurants" && <RestaurantsSection />}
            {activeTab === "orders" && <OrdersSection />}
            {activeTab === "users" && <UsersSection />}
            {activeTab === "menu" && <MenuSection />}
        </DashboardLayout>
    )
}

export default AdminDashboard
