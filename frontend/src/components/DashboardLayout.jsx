import { useState } from "react"
import { Link } from "react-router-dom"

const DashboardLayout = ({ children, activeTab, setActiveTab, navItems, title = "Dashboard" }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Default nav items if not provided
    const defaultNavItems = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "restaurants", label: "Restaurants", icon: "🍽️" },
        { id: "orders", label: "Orders", icon: "📦" },
        { id: "users", label: "Users", icon: "👥" },
        { id: "menu", label: "Menu", icon: "📋" },
    ]

    const items = navItems || defaultNavItems

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Mobile menu button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
            >
                <span className="text-2xl">{sidebarOpen ? "✕" : "☰"}</span>
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                        {title}
                    </h2>

                    <nav className="space-y-2">
                        {items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id)
                                    setSidebarOpen(false)
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Quick stats in sidebar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t dark:border-gray-700">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                        <span>←</span>
                        <span>Back to Store</span>
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <main className="lg:ml-64 pt-16 min-h-screen">
                <div className="p-6 lg:p-8">{children}</div>
            </main>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                ></div>
            )}
        </div>
    )
}

export default DashboardLayout
