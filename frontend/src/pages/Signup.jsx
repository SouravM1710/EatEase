import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import authApi from "../api/authApi"
import { getRoleLabel } from "../utils/roleUtils"

const Signup = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("USER")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!username || !password) {
      setError("Please fill in all fields")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      // Call backend registration API
      await authApi.register({
        username,
        password,
        role,
      })

      // Show success message and redirect to login
      alert("Registration successful! Please login with your credentials.")
      navigate("/login")
    } catch (err) {
      setError(err.message || "Registration failed. Username may already exist.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-lg p-8">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create an account ✨
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">
          Join EatEase and start ordering
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Username
            </label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Must be at least 6 characters
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Sign up as
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            >
              <option value="USER">{getRoleLabel("USER")}</option>
              <option value="OWNER">{getRoleLabel("OWNER")}</option>
              <option value="ADMIN">{getRoleLabel("ADMIN")}</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-500 font-medium hover:text-red-600"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
