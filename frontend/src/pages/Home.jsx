import restaurants from "../data/restaurants"
import RestaurantCard from "../components/RestaurantCard"

const Home = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Order food from your favorite restaurants
          </h1>
          <p className="text-gray-500 mt-3 max-w-2xl">
            Discover the best food near you, delivered fast and fresh.
          </p>
        </div>
      </section>

      {/* Restaurant List */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Popular Restaurants
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
