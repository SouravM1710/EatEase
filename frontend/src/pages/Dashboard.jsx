import { useAuth } from "../context/AuthContext"
import CustomerDashboard from "./CustomerDashboard"
import RestaurantDashboard from "./RestaurantDashboard"
import AdminDashboard from "./AdminDashboard"

const Dashboard = () => {
    const { user } = useAuth()

    // Route to appropriate dashboard based on user role
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Please log in to access your dashboard
                    </h2>
                    <a
                        href="/login"
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                        Go to Login
                    </a>
                </div>
            </div>
        )
    }

    // Render dashboard based on user role (using backend enums)
    switch (user.role) {
        case "USER":
            return <CustomerDashboard />
        case "OWNER":
            return <RestaurantDashboard />
        case "ADMIN":
            return <AdminDashboard />
        default:
            return <CustomerDashboard />
    }
}

export default Dashboard
