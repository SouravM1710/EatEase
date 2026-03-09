import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useOrders } from "../context/OrderContext"
import { useRestaurant } from "../context/RestaurantContext"
import DashboardLayout from "../components/DashboardLayout"
import StatsCard from "../components/StatsCard"
import { getStatusLabel, getStatusColor, getAllStatuses } from "../utils/statusUtils"

const RestaurantDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview")
    const [showAddItemModal, setShowAddItemModal] = useState(false)
    const [newItem, setNewItem] = useState({ name: "", price: "", description: "" })
    const { user } = useAuth()
    const { orders, updateOrderStatus, getOrderStats, fetchOrders, loading: ordersLoading } = useOrders()
    const { currentRestaurant, loading: restaurantLoading, addMenuItem } = useRestaurant()

    // Fetch orders for this restaurant when it's loaded
    useEffect(() => {
        if (currentRestaurant?.id) {
            fetchOrders(currentRestaurant.id)
        }
    }, [currentRestaurant])

    // Calculate today's stats
    const todayOrders = orders.filter(
        (o) => new Date(o.orderDate).toDateString() === new Date().toDateString()
    )
    const todayRevenue = todayOrders
        .filter((o) => o.status === "COMPLETED")
        .reduce((sum, order) => {
            const orderTotal = order.items?.reduce((itemSum, item) =>
                itemSum + (item.dish?.price || 0) * item.quantity, 0
            ) || 0
            return sum + orderTotal
        }, 0)

    const navItems = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "orders", label: "Orders", icon: "📦" },
        { id: "menu", label: "Menu", icon: "📋" },
        { id: "profile", label: "Profile", icon: "🏪" },
        { id: "analytics", label: "Analytics", icon: "📈" },
    ]

    // Handle Add Item
    const handleAddItem = async (e) => {
        e.preventDefault()
        if (!newItem.name || !newItem.price) {
            alert("Please fill in all required fields")
            return
        }
        if (parseFloat(newItem.price) <= 0) {
            alert("Price must be greater than 0")
            return
        }
        try {
            await addMenuItem(currentRestaurant.id, {
                name: newItem.name,
                price: parseFloat(newItem.price),
                description: newItem.description,
            })
            setNewItem({ name: "", price: "", description: "" })
            setShowAddItemModal(false)
        } catch (err) {
            alert("Failed to add menu item: " + err.message)
        }
    }

    // Show loading state
    if (restaurantLoading || !currentRestaurant) {
        return (
            <DashboardLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                navItems={navItems}
                title="Loading..."
            >
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-6xl mb-4">⏳</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Loading restaurant data...
                        </h3>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    // Overview Section
    const OverviewSection = () => (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentRestaurant.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{currentRestaurant.cuisine}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon="💰"
                    title="Today's Revenue"
                    value={`₹${todayRevenue.toFixed(2)}`}
                    change="+12%"
                    changeType="up"
                    gradient="from-green-500 to-emerald-600"
                />
                <StatsCard
                    icon="📦"
                    title="Today's Orders"
                    value={todayOrders.length}
                    change="+5"
                    changeType="up"
                    gradient="from-blue-500 to-cyan-600"
                />
                <StatsCard
                    icon="⭐"
                    title="Rating"
                    value={currentRestaurant.rating || "N/A"}
                    gradient="from-yellow-500 to-orange-600"
                />
                <StatsCard
                    icon="🍽️"
                    title="Menu Items"
                    value={currentRestaurant.menu?.length || 0}
                    gradient="from-purple-500 to-pink-600"
                />
            </div>

            {/* Active Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Active Orders
                </h2>
                {ordersLoading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        Loading orders...
                    </p>
                ) : (
                    <div className="space-y-3">
                        {orders
                            .filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED")
                            .map((order) => {
                                const orderTotal = order.items?.reduce((sum, item) =>
                                    sum + (item.dish?.price || 0) * item.quantity, 0
                                ) || 0

                                return (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                Order #{order.id}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {order.items?.length || 0} items • ₹{orderTotal.toFixed(2)}
                                            </p>
                                        </div>
                                        <select
                                            value={order.status}
                                            onChange={async (e) => {
                                                try {
                                                    await updateOrderStatus(order.id, e.target.value)
                                                } catch (err) {
                                                    alert("Failed to update order status")
                                                }
                                            }}
                                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer"
                                        >
                                            <option value="PLACED">Pending</option>
                                            <option value="PREPARING">Preparing</option>
                                            <option value="READY">Ready for Pickup</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </div>
                                )
                            })}
                        {orders.filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED")
                            .length === 0 && (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                    No active orders
                                </p>
                            )}
                    </div>
                )}
            </div>
        </div>
    )

    // Orders Section
    const OrdersSection = () => (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                All Orders
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Items</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {myOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                        {order.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        {order.customerName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {order.items.length} items
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        ₹{order.total}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(order.status)}`}
                                        >
                                            <option value="PLACED">Pending</option>
                                            <option value="PREPARING">Preparing</option>
                                            <option value="READY">Ready for Pickup</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(order.orderTime).toLocaleTimeString()}
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
                <button
                    onClick={() => setShowAddItemModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                    + Add Item
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentRestaurant.menu?.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {item.name}
                            </h3>
                            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                ₹{item.price}
                            </span>
                        </div>
                        {item.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {item.description}
                            </p>
                        )}
                        <div className="flex gap-2">
                            <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                Edit
                            </button>
                            <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Item Modal */}
            {showAddItemModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Add New Menu Item
                        </h2>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Item Name *
                                </label>
                                <input
                                    type="text"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., Paneer Tikka"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    value={newItem.price}
                                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., 250"
                                    min="1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                                    placeholder="Brief description of the item"
                                    rows="3"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddItemModal(false)
                                        setNewItem({ name: "", price: "", description: "" })
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )


    // Analytics Section
    const AnalyticsSection = () => (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analytics
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Order Status Distribution
                    </h3>
                    <div className="space-y-3">
                        {["pending", "preparing", "ready", "delivered", "cancelled"].map(
                            (status) => {
                                const count = myOrders.filter((o) => o.status === status).length
                                const percentage = myOrders.length > 0 ? (count / myOrders.length) * 100 : 0
                                return (
                                    <div key={status}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {getStatusLabel(status)}
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {count} ({percentage.toFixed(0)}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            }
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Revenue Summary
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Total Revenue</span>
                            <span className="text-2xl font-bold text-green-600">
                                ₹{myOrders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.total, 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Average Order Value</span>
                            <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                ₹{myOrders.length > 0 ? Math.round(myOrders.reduce((sum, o) => sum + o.total, 0) / myOrders.length) : 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Total Orders</span>
                            <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                {myOrders.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    // Profile Section
    const ProfileSection = () => {
        const [profileData, setProfileData] = useState({
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            image: restaurant.image,
            address: restaurant.address,
            phone: restaurant.phone,
            hours: restaurant.hours,
            description: restaurant.description,
        })

        const handleSaveProfile = (e) => {
            e.preventDefault()
            updateRestaurantProfile(profileData)
            alert("Profile updated successfully!")
        }

        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Restaurant Profile
                </h1>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Restaurant Name
                                </label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Cuisine Type
                                </label>
                                <input
                                    type="text"
                                    value={profileData.cuisine}
                                    onChange={(e) => setProfileData({ ...profileData, cuisine: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Operating Hours
                                </label>
                                <input
                                    type="text"
                                    value={profileData.hours}
                                    onChange={(e) => setProfileData({ ...profileData, hours: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., 10:00 AM - 11:00 PM"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                value={profileData.address}
                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Image URL
                            </label>
                            <input
                                type="url"
                                value={profileData.image}
                                onChange={(e) => setProfileData({ ...profileData, image: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={profileData.description}
                                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                                rows="4"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <DashboardLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navItems={navItems}
            title={currentRestaurant.name}
        >
            {activeTab === "overview" && <OverviewSection />}
            {activeTab === "orders" && <OrdersSection />}
            {activeTab === "menu" && <MenuSection />}
            {activeTab === "profile" && <ProfileSection />}
            {activeTab === "analytics" && <AnalyticsSection />}
        </DashboardLayout>
    )
}

export default RestaurantDashboard
