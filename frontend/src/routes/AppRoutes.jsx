import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Cart from "../pages/Cart"
import Login from "../pages/Login"
import Signup from "../pages/Signup"
import RestaurantMenu from "../pages/RestaurantMenu"
import Checkout from "../pages/Checkout"


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/restaurant/:id" element={<RestaurantMenu />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  )
}

export default AppRoutes