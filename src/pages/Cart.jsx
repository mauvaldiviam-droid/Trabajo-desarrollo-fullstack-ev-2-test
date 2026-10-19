import CartItem from '../components/CartItem.jsx'
import { useTienda } from '../context/TiendaContext.jsx'
import { formatearPrecio } from '../services/productos.js'

export default function Cart() {
  const { carrito, total, agregar, quitar, eliminar, vaciar, comprar } = useTienda()

  return (
    <main>
      <section className="contenedor">
        <div className="seccion__titulo">
          <h2>Tu carrito</h2>
        </div>

        <div id="lista-carrito" className="carrito-lista">
          {carrito.length === 0 && <p className="carrito-vacio">Tu carrito está vacío.</p>}
          {carrito.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onAgregar={agregar}
              onQuitar={quitar}
              onEliminar={eliminar}
            />
          ))}
        </div>

        <div className="carrito__resumen">
          <span className="carrito__resumen-label">Total</span>
          <span className="etiqueta-precio" id="carrito-total">{`$${formatearPrecio(total)}`}</span>
        </div>

        <div className="carrito__acciones">
          <button id="btn-vaciar" className="btn-secundario" onClick={vaciar}>Vaciar carrito</button>
          <button id="btn-comprar" onClick={comprar}>Finalizar compra</button>
        </div>
      </section>
    </main>
  )
}
