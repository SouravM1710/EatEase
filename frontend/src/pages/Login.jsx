import { Link } from "react-router-dom"

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-sm p-8">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back 👋
        </h1>
        <p className="text-gray-500 mt-1 mb-6">
          Login to continue ordering food
        </p>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-6 text-center">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-red-500 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
