import { Link } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext.jsx'
import { rutaImagen } from '../services/productos.js'

export default function Header({ showNav = false }) {
  const { totalItems } = useTienda()

  return (
    <header className="header">
      <div className="header__fila">
        <Link to="/" className="header__marca">
          <span className="header__logo">FERRE<span className="header__logo-acento">TECH</span></span>
          <span className="header__eslogan">Herramientas &amp; construcción</span>
        </Link>

        {showNav && (
          <nav className="header__nav">
            <Link to="/login" className="header__enlace">Mi cuenta</Link>
            <Link to="/carrito" className="carrito_compras" id="link-carrito">
              <img src={rutaImagen('img/descarga.png')} alt="" className="imagen_carrito" />
              <span className="carrito__contador" id="contador-carrito">{totalItems}</span>
              <span className="sr-only">Carrito de compras</span>
            </Link>
          </nav>
        )}
      </div>
      <div className="franja-peligro" aria-hidden="true"></div>
    </header>
  )
}
