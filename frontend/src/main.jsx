import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { RestaurantProvider } from "./context/RestaurantContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <RestaurantProvider>
            <OrderProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </OrderProvider>
          </RestaurantProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
