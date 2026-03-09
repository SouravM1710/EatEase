import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"

const Cart = () => {
  const { cartItems, addToCart, removeFromCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Your cart is empty 🛒
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven’t added anything yet
        </p>
        <Link
          to="/"
          className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600"
        >
          Browse Restaurants
        </Link>
      </div>
    )
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const deliveryFee = 40
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryFee + tax

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold mb-4">
            Your Cart
          </h1>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-gray-900">
                  {item.name}
                </h3>
                <p className="text-gray-500">
                  ₹{item.price}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="w-8 h-8 border rounded-full text-lg"
                >
                  −
                </button>
                <span className="font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => addToCart(item)}
                  className="w-8 h-8 border rounded-full text-lg"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-4">
            Order Summary
          </h2>

          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>₹{tax}</span>
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <Link
            to="/checkout"
            className="block mt-6 bg-red-500 text-white text-center py-3 rounded-full hover:bg-red-600"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
