import { useCart } from "../context/CartContext"

const Checkout = () => {
  const { cartItems } = useCart()

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const deliveryFee = 40
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryFee + tax

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6">
          Checkout
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Order Items */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Order Summary
            </h2>

            <div className="space-y-2 text-gray-600">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <hr />

          {/* Price */}
          <div className="space-y-2 text-gray-700">
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

          <hr />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600">
            Place Order
          </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout
