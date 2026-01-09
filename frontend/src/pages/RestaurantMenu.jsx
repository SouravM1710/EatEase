import { useParams } from "react-router-dom"
import restaurants from "../data/restaurants"
import { useCart } from "../context/CartContext"

const RestaurantMenu = () => {
  const { id } = useParams()
  const { cartItems, addToCart, removeFromCart } = useCart()

  const restaurant = restaurants.find(
    (res) => res.id === Number(id)
  )

  if (!restaurant) {
    return <div className="p-8">Restaurant not found</div>
  }

  const getQuantity = (itemId) => {
    const item = cartItems.find((i) => i.id === itemId)
    return item ? item.quantity : 0
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {restaurant.name}
          </h1>
          <p className="text-gray-500 mt-1">
            {restaurant.cuisine}
          </p>

          <div className="flex gap-6 mt-4 text-sm text-gray-600">
            <span>⭐ {restaurant.rating}</span>
            <span>{restaurant.time}</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">
          Recommended
        </h2>

        <div className="space-y-5">
          {restaurant.menu.map((item) => {
            const qty = getQuantity(item.id)

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-5 shadow-sm flex justify-between items-center"
              >
                {/* Food info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 mt-1">
                    ₹{item.price}
                  </p>
                </div>

                {/* Controls */}
                {qty === 0 ? (
                  <button
                    onClick={() => addToCart(item)}
                    className="border border-red-500 text-red-500 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition"
                  >
                    Add
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 rounded-full border text-lg"
                    >
                      −
                    </button>
                    <span className="font-medium">{qty}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-8 h-8 rounded-full border text-lg"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RestaurantMenu
