import { createContext, useContext, useState, useEffect } from "react"
import ownerApi from "../api/ownerApi"
import customerApi from "../api/customerApi"
import { useAuth } from "./AuthContext"

const RestaurantContext = createContext()

export const useRestaurant = () => {
    const context = useContext(RestaurantContext)
    if (!context) {
        throw new Error("useRestaurant must be used within RestaurantProvider")
    }
    return context
}

export const RestaurantProvider = ({ children }) => {
    const { user } = useAuth()
    const [restaurants, setRestaurants] = useState([])
    const [currentRestaurant, setCurrentRestaurant] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Fetch restaurants based on user role
    const fetchRestaurants = async () => {
        if (!user) return

        setLoading(true)
        setError(null)
        try {
            let data
            if (user.role === "OWNER") {
                // Owner: fetch their restaurants
                data = await ownerApi.getMyRestaurants()
                setRestaurants(data)
                // Set first restaurant as current if available
                if (data.length > 0 && !currentRestaurant) {
                    setCurrentRestaurant(data[0])
                }
            } else {
                // Customer/Admin: fetch all restaurants
                data = await customerApi.getRestaurants()
                setRestaurants(data)
            }
        } catch (err) {
            setError(err.message || "Failed to fetch restaurants")
            console.error("Error fetching restaurants:", err)
        } finally {
            setLoading(false)
        }
    }

    // Create a new restaurant (Owner only)
    const createRestaurant = async (restaurantData) => {
        try {
            const newRestaurant = await ownerApi.createRestaurant(restaurantData)
            setRestaurants(prev => [...prev, newRestaurant])
            if (!currentRestaurant) {
                setCurrentRestaurant(newRestaurant)
            }
            return newRestaurant
        } catch (err) {
            setError(err.message || "Failed to create restaurant")
            throw err
        }
    }

    // Update restaurant profile
    const updateRestaurantProfile = (updatedData) => {
        setCurrentRestaurant(prev => ({
            ...prev,
            ...updatedData,
        }))
    }

    // Add menu item (Owner only)
    const addMenuItem = async (restaurantId, dishData) => {
        try {
            const newDish = await ownerApi.addDish(restaurantId, dishData)

            // Update local state
            setRestaurants(prev =>
                prev.map(restaurant =>
                    restaurant.id === restaurantId
                        ? { ...restaurant, menu: [...(restaurant.menu || []), newDish] }
                        : restaurant
                )
            )

            // Update current restaurant if it's the one being modified
            if (currentRestaurant?.id === restaurantId) {
                setCurrentRestaurant(prev => ({
                    ...prev,
                    menu: [...(prev.menu || []), newDish],
                }))
            }

            return newDish
        } catch (err) {
            setError(err.message || "Failed to add menu item")
            throw err
        }
    }

    // Edit menu item (Owner only)
    const editMenuItem = async (restaurantId, dishId, dishData) => {
        try {
            const updatedDish = await ownerApi.updateDish(restaurantId, dishId, dishData)

            // Update local state
            setRestaurants(prev =>
                prev.map(restaurant =>
                    restaurant.id === restaurantId
                        ? {
                            ...restaurant,
                            menu: restaurant.menu?.map(item =>
                                item.id === dishId ? updatedDish : item
                            ) || []
                        }
                        : restaurant
                )
            )

            // Update current restaurant if it's the one being modified
            if (currentRestaurant?.id === restaurantId) {
                setCurrentRestaurant(prev => ({
                    ...prev,
                    menu: prev.menu?.map(item =>
                        item.id === dishId ? updatedDish : item
                    ) || [],
                }))
            }

            return updatedDish
        } catch (err) {
            setError(err.message || "Failed to update menu item")
            throw err
        }
    }

    // Delete menu item (Owner only)
    const deleteMenuItem = async (restaurantId, dishId) => {
        try {
            await ownerApi.deleteDish(restaurantId, dishId)

            // Update local state
            setRestaurants(prev =>
                prev.map(restaurant =>
                    restaurant.id === restaurantId
                        ? {
                            ...restaurant,
                            menu: restaurant.menu?.filter(item => item.id !== dishId) || []
                        }
                        : restaurant
                )
            )

            // Update current restaurant if it's the one being modified
            if (currentRestaurant?.id === restaurantId) {
                setCurrentRestaurant(prev => ({
                    ...prev,
                    menu: prev.menu?.filter(item => item.id !== dishId) || [],
                }))
            }
        } catch (err) {
            setError(err.message || "Failed to delete menu item")
            throw err
        }
    }

    // Fetch menu for a specific restaurant (Customer view)
    const fetchRestaurantMenu = async (restaurantId) => {
        try {
            const menu = await customerApi.getRestaurantMenu(restaurantId)

            // Update the restaurant in the list with the menu
            setRestaurants(prev =>
                prev.map(restaurant =>
                    restaurant.id === restaurantId
                        ? { ...restaurant, menu }
                        : restaurant
                )
            )

            return menu
        } catch (err) {
            setError(err.message || "Failed to fetch menu")
            throw err
        }
    }

    // Load restaurants when user changes
    useEffect(() => {
        if (user) {
            fetchRestaurants()
        } else {
            setRestaurants([])
            setCurrentRestaurant(null)
        }
    }, [user])

    const value = {
        restaurants,
        currentRestaurant,
        setCurrentRestaurant,
        loading,
        error,
        fetchRestaurants,
        createRestaurant,
        updateRestaurantProfile,
        addMenuItem,
        editMenuItem,
        deleteMenuItem,
        fetchRestaurantMenu,
    }

    return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>
}
