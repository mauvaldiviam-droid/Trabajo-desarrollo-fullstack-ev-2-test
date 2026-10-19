import { beforeEach, expect, test } from "vitest";
import { productosIniciales } from "../data/productos";
import {
    actualizarProducto,
    ajustarStock,
    crearProducto,
    eliminarProducto,
    estadoStock,
    formatearPrecio,
    obtenerProductos,
    rutaImagen,
    siguienteIdProducto,
} from "../services/productos";

beforeEach(() => {
    localStorage.clear()
})

test('estadoStock distingue agotado, pocas unidades y en stock', () => {

    //resultados
    expect(estadoStock(0)).toEqual({ texto: 'Agotado', clase: 'stock--agotado' })
    expect(estadoStock(5)).toEqual({ texto: 'Pocas unidades', clase: 'stock--bajo' })
    expect(estadoStock(9).texto).toBe('Pocas unidades')
    expect(estadoStock(10)).toEqual({ texto: 'En stock', clase: 'stock--ok' })
})

test('formatearPrecio usa el formato chileno con punto de miles', () => {

    //resultados
    expect(formatearPrecio(5990)).toBe('5.990')
    expect(formatearPrecio(1000000)).toBe('1.000.000')
})

test('siguienteIdProducto entrega el mayor id más uno', () => {

    //resultados
    expect(siguienteIdProducto([])).toBe(1)
    expect(siguienteIdProducto([{ id: 1 }, { id: 3 }])).toBe(4)
})

test('la primera vez carga los productos iniciales y los guarda', () => {

    //interaccion
    const productos = obtenerProductos()

    //resultados
    expect(productos).toEqual(productosIniciales)
    expect(JSON.parse(localStorage.getItem('productos'))).toHaveLength(3)
})

test('modificar los productos guardados no altera los datos iniciales', () => {

    //interaccion
    ajustarStock(1, -5)

    //resultados
    expect(productosIniciales[0].stock).toBe(12)
})

test('ajustarStock suma y resta unidades', () => {

    //resultados
    expect(ajustarStock(1, -2)).toBe(10)
    expect(ajustarStock(1, 3)).toBe(13)
})

test('ajustarStock nunca deja el stock bajo cero', () => {

    //resultados
    expect(ajustarStock(2, -100)).toBe(0)
})

test('ajustarStock devuelve null si el producto no existe', () => {

    //resultados
    expect(ajustarStock(999, 1)).toBeNull()
})

test('crearProducto asigna el siguiente id y lo guarda', () => {

    //interaccion
    const nuevo = crearProducto({ nombre: 'Taladro', precio: 39990, stock: 8, imagen: 'img/a.jpg', detalles: 'Potente' })

    //resultados
    expect(nuevo.id).toBe(4)
    expect(obtenerProductos()).toHaveLength(4)
    expect(obtenerProductos()[3].nombre).toBe('Taladro')
})

test('actualizarProducto cambia solo los campos indicados', () => {

    //interaccion
    const actualizado = actualizarProducto(1, { precio: 1000 })

    //resultados
    expect(actualizado.precio).toBe(1000)
    expect(actualizado.nombre).toBe('Brocha')
    expect(obtenerProductos()[0].precio).toBe(1000)
})

test('actualizarProducto devuelve null si el producto no existe', () => {

    //resultados
    expect(actualizarProducto(999, { precio: 1 })).toBeNull()
})

test('eliminarProducto quita el producto del catálogo', () => {

    //interaccion
    eliminarProducto(2)

    //resultados
    const ids = obtenerProductos().map((p) => p.id)
    expect(ids).toEqual([1, 3])
})

test('rutaImagen resuelve rutas relativas y respeta URLs absolutas', () => {

    //resultados
    expect(rutaImagen('')).toBe('')
    expect(rutaImagen('img/a.jpg')).toBe('/img/a.jpg')
    expect(rutaImagen('/img/a.jpg')).toBe('/img/a.jpg')
    expect(rutaImagen('https://sitio.cl/a.jpg')).toBe('https://sitio.cl/a.jpg')
    expect(rutaImagen('data:image/png;base64,AAAA')).toBe('data:image/png;base64,AAAA')
})
