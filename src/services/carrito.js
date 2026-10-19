import { ajustarStock, obtenerProductos } from './productos.js'

const CLAVE_CARRITO = 'carrito'

export function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
}

export function obtenerCarrito() {
  const datos = localStorage.getItem(CLAVE_CARRITO)
  return datos ? JSON.parse(datos) : []
}

export function calcularTotal(carrito) {
  return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0)
}

export function contarItems(carrito) {
  return carrito.reduce((total, item) => total + item.cantidad, 0)
}

// Devuelve false si el producto no tiene stock disponible.
export function agregarAlCarrito(producto) {
  const productoActual = obtenerProductos().find((p) => p.id === producto.id)

  if (!productoActual || productoActual.stock <= 0) {
    return false
  }

  ajustarStock(producto.id, -1)

  const carrito = obtenerCarrito()
  const existente = carrito.find((item) => item.id === producto.id)

  if (existente) {
    existente.cantidad += 1
  } else {
    carrito.push({ ...producto, cantidad: 1 })
  }

  guardarCarrito(carrito)
  return true
}

export function quitarDelCarrito(producto) {
  const carrito = obtenerCarrito()
  const existente = carrito.find((item) => item.id === producto.id)

  if (!existente) return

  existente.cantidad -= 1
  ajustarStock(producto.id, 1)

  const actualizado = existente.cantidad <= 0
    ? carrito.filter((item) => item.id !== producto.id)
    : carrito

  guardarCarrito(actualizado)
}

export function eliminarDelCarrito(id) {
  const carrito = obtenerCarrito()
  const item = carrito.find((i) => i.id === id)

  if (item) {
    ajustarStock(id, item.cantidad)
  }

  guardarCarrito(carrito.filter((i) => i.id !== id))
}

export function vaciarCarrito() {
  obtenerCarrito().forEach((item) => ajustarStock(item.id, item.cantidad))
  guardarCarrito([])
}

export function finalizarCompra() {
  guardarCarrito([])
}
