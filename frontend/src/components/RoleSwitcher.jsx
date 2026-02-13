import { useAuth } from "../context/AuthContext"

const RoleSwitcher = () => {
    const { user, switchRole } = useAuth()

    if (!user) return null

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                🔧 Dev: Switch Role
            </p>
            <div className="flex gap-2">
                <button
                    onClick={() => switchRole("customer")}
                    className={`px-3 py-2 text-xs rounded-lg transition-all ${user.role === "customer"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                >
                    Customer
                </button>
                <button
                    onClick={() => switchRole("restaurant_owner", 1)}
                    className={`px-3 py-2 text-xs rounded-lg transition-all ${user.role === "restaurant_owner"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                >
                    Restaurant
                </button>
                <button
                    onClick={() => switchRole("admin")}
                    className={`px-3 py-2 text-xs rounded-lg transition-all ${user.role === "admin"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                >
                    Admin
                </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Current: <span className="font-semibold">{user.role}</span>
            </p>
        </div>
    )
}

export default RoleSwitcher
