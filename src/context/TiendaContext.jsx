import { createContext, useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductos,
} from '../services/productos.js'
import {
  agregarAlCarrito,
  calcularTotal,
  contarItems,
  eliminarDelCarrito,
  finalizarCompra,
  obtenerCarrito,
  quitarDelCarrito,
  vaciarCarrito,
} from '../services/carrito.js'

const TiendaContext = createContext(null)

export function TiendaProvider({ children }) {
  const [productos, setProductos] = useState(obtenerProductos)
  const [carrito, setCarrito] = useState(obtenerCarrito)

  function sincronizar() {
    setProductos(obtenerProductos())
    setCarrito(obtenerCarrito())
  }

  useEffect(() => {
    function alCambiarAlmacenamiento(evento) {
      if (evento.key === null || evento.key === 'productos' || evento.key === 'carrito') {
        sincronizar()
      }
    }

    window.addEventListener('storage', alCambiarAlmacenamiento)
    return () => window.removeEventListener('storage', alCambiarAlmacenamiento)
  }, [])

  function agregar(producto) {
    const agregado = agregarAlCarrito(producto)
    sincronizar()

    if (!agregado) {
      window.alert(`"${producto.nombre}" no tiene stock disponible en este momento.`)
      return
    }

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `"${producto.nombre}" agregado al carrito`,
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
    })
  }

  function quitar(producto) {
    quitarDelCarrito(producto)
    sincronizar()
  }

  function eliminar(id) {
    eliminarDelCarrito(id)
    sincronizar()
  }

  function vaciar() {
    vaciarCarrito()
    sincronizar()
  }

  function comprar() {
    if (obtenerCarrito().length === 0) {
      window.alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.')
      return
    }

    window.alert('¡Compra simulada con éxito!')
    finalizarCompra()
    sincronizar()
  }

  function agregarProducto(datos) {
    crearProducto(datos)
    sincronizar()
  }

  function editarProducto(id, cambios) {
    actualizarProducto(id, cambios)
    sincronizar()
  }

  function darDeBajaProducto(id) {
    eliminarProducto(id)
    sincronizar()
  }

  const value = {
    productos,
    carrito,
    totalItems: contarItems(carrito),
    total: calcularTotal(carrito),
    agregar,
    quitar,
    eliminar,
    vaciar,
    comprar,
    agregarProducto,
    editarProducto,
    darDeBajaProducto,
  }

  return <TiendaContext.Provider value={value}>{children}</TiendaContext.Provider>
}

export function useTienda() {
  const contexto = useContext(TiendaContext)
  if (!contexto) {
    throw new Error('useTienda debe usarse dentro de <TiendaProvider>')
  }
  return contexto
}
