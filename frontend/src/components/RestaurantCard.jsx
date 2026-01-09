import { Link } from "react-router-dom"

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
        {/* Image */}
        <div className="relative">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-44 object-cover"
          />
          <span className="absolute top-3 left-3 bg-white/90 text-sm px-2 py-1 rounded-full font-medium">
            ⭐ {restaurant.rating}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {restaurant.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {restaurant.cuisine}
          </p>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>{restaurant.time}</span>
            <span className="text-red-500 font-medium">
              View Menu →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RestaurantCard
