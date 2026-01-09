import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { cartItems } = useCart();
  const { dark, setDark } = useTheme()


  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-2xl font-extrabold text-red-500">
          EatEase
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-base font-medium">
          <Link to="/" className="hover:text-red-500">
            Home
          </Link>

          <Link to="/cart" className="relative hover:text-red-500">
            Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>

          <Link
            to="/login"
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
          >
            Login
          </Link>
          <button onClick={() => setDark(!dark)} className="text-xl">
            {dark ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
