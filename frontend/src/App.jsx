import Navbar from "./components/Navbar"
import AppRoutes from "./routes/AppRoutes"
import RoleSwitcher from "./components/RoleSwitcher"

function App() {
  return (
    <>
      <Navbar />
      <AppRoutes />
      <RoleSwitcher />
    </>
  )
}

export default App
