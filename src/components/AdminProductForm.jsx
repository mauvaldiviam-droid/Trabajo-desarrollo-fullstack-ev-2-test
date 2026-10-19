import { useState } from 'react'
import { useTienda } from '../context/TiendaContext.jsx'

const valoresIniciales = { nombre: '', precio: '', stock: '', imagen: '', detalles: '' }

export default function AdminProductForm() {
  const { agregarProducto } = useTienda()
  const [abierto, setAbierto] = useState(false)
  const [valores, setValores] = useState(valoresIniciales)

  function cambiar(campo, valor) {
    setValores((actuales) => ({ ...actuales, [campo]: valor }))
  }

  function cerrar() {
    setValores(valoresIniciales)
    setAbierto(false)
  }

  function handleSubmit(evento) {
    evento.preventDefault()

    const nombre = valores.nombre.trim()
    const precio = Number(valores.precio)
    const stock = Number(valores.stock)
    const imagen = valores.imagen.trim() || 'img/descarga.png'
    const detalles = valores.detalles.trim() || 'Sin descripción.'

    if (nombre === '' || Number.isNaN(precio) || precio < 0 || Number.isNaN(stock) || stock < 0) {
      window.alert('Completa nombre, precio y stock con valores válidos.')
      return
    }

    agregarProducto({ nombre, precio, stock, imagen, detalles })
    cerrar()
  }

  if (!abierto) {
    return (
      <button
        id="btn-agregar-producto"
        className="btn-secundario btn-agregar-producto-toggle"
        onClick={() => setAbierto(true)}
      >
        + Agregar producto
      </button>
    )
  }

  return (
    <form id="form-agregar-producto" className="form-producto-admin" onSubmit={handleSubmit}>
      <h3>Nuevo producto</h3>

      <label htmlFor="nuevo-nombre">Nombre</label>
      <input
        type="text"
        id="nuevo-nombre"
        placeholder="Ej: Taladro percutor"
        required
        value={valores.nombre}
        onChange={(evento) => cambiar('nombre', evento.target.value)}
      />

      <label htmlFor="nuevo-precio">Precio (CLP)</label>
      <input
        type="number"
        id="nuevo-precio"
        min="0"
        placeholder="Ej: 39990"
        required
        value={valores.precio}
        onChange={(evento) => cambiar('precio', evento.target.value)}
      />

      <label htmlFor="nuevo-stock">Stock</label>
      <input
        type="number"
        id="nuevo-stock"
        min="0"
        placeholder="Ej: 8"
        required
        value={valores.stock}
        onChange={(evento) => cambiar('stock', evento.target.value)}
      />

      <label htmlFor="nuevo-imagen">Foto (ruta o URL)</label>
      <input
        type="text"
        id="nuevo-imagen"
        placeholder="img/nuevo-producto.jpg"
        value={valores.imagen}
        onChange={(evento) => cambiar('imagen', evento.target.value)}
      />

      <label htmlFor="nuevo-detalles">Descripción</label>
      <input
        type="text"
        id="nuevo-detalles"
        placeholder="Breve descripción del producto"
        value={valores.detalles}
        onChange={(evento) => cambiar('detalles', evento.target.value)}
      />

      <div className="form-producto-admin__acciones">
        <button type="submit">Guardar producto</button>
        <button type="button" id="btn-cancelar-producto" className="btn-secundario" onClick={cerrar}>Cancelar</button>
      </div>
    </form>
  )
}
