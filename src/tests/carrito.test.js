import { beforeEach, expect, test } from "vitest";
import { productosIniciales } from "../data/productos";
import { obtenerProductos } from "../services/productos";
import {
    agregarAlCarrito,
    calcularTotal,
    contarItems,
    eliminarDelCarrito,
    finalizarCompra,
    obtenerCarrito,
    quitarDelCarrito,
    vaciarCarrito,
} from "../services/carrito";

const brocha = productosIniciales[0]
const tarro = productosIniciales[1]

function stockDe(id) {
    return obtenerProductos().find((p) => p.id === id).stock
}

beforeEach(() => {
    localStorage.clear()
})

test('calcular total del carrito', () => {

    //preconfiguracion
    const carrito = [
        { precio: 1000, cantidad: 3 },
        { precio: 500, cantidad: 2 },
    ]

    //resultados
    expect(calcularTotal([{ precio: 1000, cantidad: 3 }])).toBe(3000)
    expect(calcularTotal(carrito)).toBe(4000)
    expect(calcularTotal([])).toBe(0)
})

test('contar las unidades del carrito', () => {

    //preconfiguracion
    const carrito = [{ cantidad: 2 }, { cantidad: 3 }]

    //resultados
    expect(contarItems(carrito)).toBe(5)
    expect(contarItems([])).toBe(0)
})

test('el carrito parte vacío', () => {

    //resultados
    expect(obtenerCarrito()).toEqual([])
})

test('agregar un producto lo guarda con cantidad 1 y descuenta el stock', () => {

    //interaccion
    const agregado = agregarAlCarrito(brocha)

    //resultados
    expect(agregado).toBe(true)
    expect(obtenerCarrito()).toHaveLength(1)
    expect(obtenerCarrito()[0].cantidad).toBe(1)
    expect(stockDe(1)).toBe(11)
})

test('agregar el mismo producto otra vez suma la cantidad', () => {

    //interaccion
    agregarAlCarrito(brocha)
    agregarAlCarrito(brocha)

    //resultados
    expect(obtenerCarrito()).toHaveLength(1)
    expect(obtenerCarrito()[0].cantidad).toBe(2)
    expect(stockDe(1)).toBe(10)
})

test('no agrega un producto sin stock', () => {

    //preconfiguracion
    localStorage.setItem('productos', JSON.stringify([{ ...brocha, stock: 0 }]))

    //interaccion
    const agregado = agregarAlCarrito(brocha)

    //resultados
    expect(agregado).toBe(false)
    expect(obtenerCarrito()).toEqual([])
})

test('no agrega un producto que no existe en el catálogo', () => {

    //interaccion
    const agregado = agregarAlCarrito({ id: 999, nombre: 'Fantasma', precio: 1 })

    //resultados
    expect(agregado).toBe(false)
    expect(obtenerCarrito()).toEqual([])
})

test('quitar una unidad devuelve el stock y mantiene el producto si quedan unidades', () => {

    //preconfiguracion
    agregarAlCarrito(tarro)
    agregarAlCarrito(tarro)

    //interaccion
    quitarDelCarrito(tarro)

    //resultados
    expect(obtenerCarrito()[0].cantidad).toBe(1)
    expect(stockDe(2)).toBe(4)
})

test('quitar la última unidad elimina el producto del carrito', () => {

    //preconfiguracion
    agregarAlCarrito(tarro)

    //interaccion
    quitarDelCarrito(tarro)

    //resultados
    expect(obtenerCarrito()).toEqual([])
    expect(stockDe(2)).toBe(5)
})

test('quitar un producto que no está en el carrito no cambia nada', () => {

    //interaccion
    quitarDelCarrito(brocha)

    //resultados
    expect(obtenerCarrito()).toEqual([])
    expect(stockDe(1)).toBe(12)
})

test('eliminar un producto devuelve todo su stock', () => {

    //preconfiguracion
    agregarAlCarrito(tarro)
    agregarAlCarrito(tarro)
    agregarAlCarrito(tarro)

    //interaccion
    eliminarDelCarrito(2)

    //resultados
    expect(obtenerCarrito()).toEqual([])
    expect(stockDe(2)).toBe(5)
})

test('vaciar el carrito devuelve el stock de todos los productos', () => {

    //preconfiguracion
    agregarAlCarrito(brocha)
    agregarAlCarrito(tarro)
    agregarAlCarrito(tarro)

    //interaccion
    vaciarCarrito()

    //resultados
    expect(obtenerCarrito()).toEqual([])
    expect(stockDe(1)).toBe(12)
    expect(stockDe(2)).toBe(5)
})

test('finalizar la compra vacía el carrito pero deja el stock descontado', () => {

    //preconfiguracion
    agregarAlCarrito(tarro)
    agregarAlCarrito(tarro)

    //interaccion
    finalizarCompra()

    //resultados
    expect(obtenerCarrito()).toEqual([])
    expect(stockDe(2)).toBe(3)
})
