import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

/**
 * Protects routes that require authentication.
 * Optionally restricts access to specific roles.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {string[]} [props.allowedRoles] - Optional list of roles allowed (e.g. ["USER"])
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth()
    const location = useLocation()

    // Not logged in → redirect to login, remembering where they wanted to go
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />
    }

    // Logged in but wrong role → redirect to home
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute
