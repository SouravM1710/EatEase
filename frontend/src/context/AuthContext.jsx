import { createContext, useContext, useState, useEffect } from "react"
import authApi from "../api/authApi"
import { getAuthCredentials } from "../api/apiConfig"

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Check if user is already logged in (credentials exist)
    useEffect(() => {
        const credentials = getAuthCredentials()
        if (credentials) {
            // User has credentials, set user data from localStorage if available
            const savedUser = localStorage.getItem('user')
            if (savedUser) {
                setUser(JSON.parse(savedUser))
            }
        }
    }, [])

    const login = async (username, password) => {
        setLoading(true)
        setError(null)
        try {
            const userData = await authApi.login(username, password)
            setUser(userData)
            // Save user data to localStorage (without password)
            localStorage.setItem('user', JSON.stringify(userData))
            return userData
        } catch (err) {
            setError(err.message || 'Login failed')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        authApi.logout()
        setUser(null)
        localStorage.removeItem('user')
    }

    const switchRole = (role, restaurantId = null) => {
        // Note: This is for UI demo purposes only
        // In production, role switching should be handled by backend
        setUser({ ...user, role, restaurantId })
    }

    const value = {
        user,
        login,
        logout,
        switchRole,
        isAuthenticated: !!user,
        loading,
        error,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
