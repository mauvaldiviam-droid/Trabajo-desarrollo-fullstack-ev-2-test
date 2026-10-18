import { productosIniciales } from '../data/productos.js'

const CLAVE_PRODUCTOS = 'productos'

export function obtenerProductos() {
  const datos = localStorage.getItem(CLAVE_PRODUCTOS)
  if (datos) return JSON.parse(datos)

  // Copia para no mutar los datos iniciales del módulo
  const iniciales = JSON.parse(JSON.stringify(productosIniciales))
  guardarProductos(iniciales)
  return iniciales
}

export function guardarProductos(productos) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos))
}

export function siguienteIdProducto(productos) {
  return productos.reduce((max, p) => Math.max(max, p.id), 0) + 1
}

export function estadoStock(stock) {
  if (stock <= 0) {
    return { texto: 'Agotado', clase: 'stock--agotado' }
  }
  if (stock < 10) {
    return { texto: 'Pocas unidades', clase: 'stock--bajo' }
  }
  return { texto: 'En stock', clase: 'stock--ok' }
}

export function formatearPrecio(precio) {
  return precio.toLocaleString('es-CL')
}

export function ajustarStock(idProducto, delta) {
  const productos = obtenerProductos()
  const producto = productos.find((p) => p.id === idProducto)
  if (!producto) return null

  producto.stock = Math.max(0, producto.stock + delta)
  guardarProductos(productos)
  return producto.stock
}

export function crearProducto({ nombre, precio, stock, imagen, detalles }) {
  const productos = obtenerProductos()
  const nuevoProducto = {
    id: siguienteIdProducto(productos),
    nombre, precio, stock, imagen, detalles,
  }

  productos.push(nuevoProducto)
  guardarProductos(productos)
  return nuevoProducto
}

export function actualizarProducto(idProducto, cambios) {
  const productos = obtenerProductos()
  const producto = productos.find((p) => p.id === idProducto)
  if (!producto) return null

  Object.assign(producto, cambios)
  guardarProductos(productos)
  return producto
}

export function eliminarProducto(idProducto) {
  const actualizados = obtenerProductos().filter((p) => p.id !== idProducto)
  guardarProductos(actualizados)
  return actualizados
}

export function rutaImagen(ruta) {
  if (!ruta) return ''
  if (/^(https?:|data:|blob:|\/)/i.test(ruta)) return ruta
  return `${import.meta.env.BASE_URL}${ruta}`
}
