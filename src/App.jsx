import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { TiendaProvider } from './context/TiendaContext.jsx'
import AdminHome from './pages/AdminHome.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import Cart from './pages/Cart.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ResetPassword from './pages/ResetPassword.jsx'

export default function App() {
  return (
    <TiendaProvider>
      <Routes>
        <Route element={<Layout showNav />}>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/carrito" element={<Cart />} />
        </Route>

        {/* Páginas de acceso: header solo con la marca */}
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/ingreso" element={<Register />} />
          <Route path="/ingreso-admin" element={<AdminLogin />} />
          <Route path="/restablecer" element={<ResetPassword />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TiendaProvider>
  )
}
