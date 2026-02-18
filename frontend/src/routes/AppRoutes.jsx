import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Cart from "../pages/Cart"
import Login from "../pages/Login"
import Signup from "../pages/Signup"
import RestaurantMenu from "../pages/RestaurantMenu"
import Checkout from "../pages/Checkout"
import Payment from "../pages/Payment"
import Dashboard from "../pages/Dashboard"
import ProtectedRoute from "../components/ProtectedRoute"


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/restaurant/:id" element={<RestaurantMenu />} />

      {/* Customer-only routes */}
      <Route path="/cart" element={
        <ProtectedRoute allowedRoles={["USER"]}>
          <Cart />
        </ProtectedRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute allowedRoles={["USER"]}>
          <Checkout />
        </ProtectedRoute>
      } />
      <Route path="/payment" element={
        <ProtectedRoute allowedRoles={["USER"]}>
          <Payment />
        </ProtectedRoute>
      } />

      {/* Any authenticated user */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default AppRoutes