import { useState } from 'react'
import { useTienda } from '../context/TiendaContext.jsx'
import ProductCard from './ProductCard.jsx'

export default function Catalog({ admin = false, children }) {
  const { productos, agregar, editarProducto, darDeBajaProducto } = useTienda()
  const [texto, setTexto] = useState('')

  const buscado = texto.trim().toLowerCase()
  const visibles = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(buscado),
  )

  function handleBaja(producto) {
    if (window.confirm(`¿Dar de baja "${producto.nombre}" del catálogo? Esta acción no se puede deshacer.`)) {
      darDeBajaProducto(producto.id)
    }
  }

  function handleEditar(producto) {
    const nuevoPrecio = window.prompt(`Nuevo precio para "${producto.nombre}":`, producto.precio)
    if (nuevoPrecio === null) return

    const nuevoStock = window.prompt(`Nuevo stock para "${producto.nombre}":`, producto.stock)
    if (nuevoStock === null) return

    const precioNum = Number(nuevoPrecio)
    const stockNum = Number(nuevoStock)

    if (Number.isNaN(precioNum) || precioNum < 0 || Number.isNaN(stockNum) || stockNum < 0) {
      window.alert('Precio y stock deben ser números válidos (0 o mayores).')
      return
    }

    editarProducto(producto.id, { precio: precioNum, stock: stockNum })
  }

  return (
    <section className="contenedor">

      <div className="seccion__titulo">
        <h2>Catálogo de productos</h2>
        <p className="seccion__subtitulo">Precios en CLP, stock sujeto a disponibilidad.</p>
      </div>

      <div className="buscador">
        <input
          type="text"
          id="buscador-input"
          placeholder="Buscar producto..."
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
        />
      </div>

      <div id="catalogo" className="catalogo">
        {visibles.length === 0 ? (
          <p className="catalogo-vacio">No se encontraron productos.</p>
        ) : (
          visibles.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              admin={admin}
              onAgregar={agregar}
              onEditar={handleEditar}
              onBaja={handleBaja}
            />
          ))
        )}
      </div>

      {children}
    </section>
  )
}
