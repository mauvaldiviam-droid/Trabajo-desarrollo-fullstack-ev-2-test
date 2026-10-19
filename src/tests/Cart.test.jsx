import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { productosIniciales } from "../data/productos";
import { agregarAlCarrito } from "../services/carrito";
import { obtenerProductos } from "../services/productos";
import { TiendaProvider } from "../context/TiendaContext";
import Cart from "../pages/Cart";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }))

function renderCarrito() {
    return render(
        <TiendaProvider>
            <Cart />
        </TiendaProvider>
    )
}

function cargarTarroEnElCarrito(cantidad) {
    for (let i = 0; i < cantidad; i++) {
        agregarAlCarrito(productosIniciales[1])
    }
}

function stockDelTarro() {
    return obtenerProductos().find((p) => p.id === 2).stock
}

beforeEach(() => {
    localStorage.clear()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
})

afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
})

test('Muestra un mensaje cuando el carrito está vacío', () => {

    //renderizado del componente
    renderCarrito()

    //resultados
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
    expect(screen.getByText('$0', { selector: '#carrito-total' })).toBeInTheDocument()
})

test('Muestra los productos del carrito y el total a pagar', () => {

    //preconfiguracion
    cargarTarroEnElCarrito(2)

    //renderizado del componente
    renderCarrito()

    //resultados
    expect(screen.getByText('Tarro de pintura')).toBeInTheDocument()
    expect(screen.getByText('$91.980', { selector: '#carrito-total' })).toBeInTheDocument()
})

test('El botón + suma una unidad y descuenta una del stock', async () => {

    //preconfiguracion
    cargarTarroEnElCarrito(2)

    //renderizado del componente
    renderCarrito()

    //interaccion del usuario
    await userEvent.click(screen.getByText('+', { selector: 'button' }))

    //resultados
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(stockDelTarro()).toBe(2)
})

test('El botón − resta una unidad y devuelve una al stock', async () => {

    //preconfiguracion
    cargarTarroEnElCarrito(2)

    //renderizado del componente
    renderCarrito()

    //interaccion del usuario
    await userEvent.click(screen.getByText('−', { selector: 'button' }))

    //resultados
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(stockDelTarro()).toBe(4)
})

test('Quitar elimina el producto y devuelve todo su stock', async () => {

    //preconfiguracion
    cargarTarroEnElCarrito(2)

    //renderizado del componente
    renderCarrito()

    //interaccion del usuario
    await userEvent.click(screen.getByText('Quitar', { selector: 'button' }))

    //resultados
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
    expect(stockDelTarro()).toBe(5)
})

test('Vaciar carrito deja el carrito vacío y devuelve el stock', async () => {

    //preconfiguracion
    cargarTarroEnElCarrito(2)

    //renderizado del componente
    renderCarrito()

    //interaccion del usuario
    await userEvent.click(screen.getByText('Vaciar carrito', { selector: 'button' }))

    //resultados
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
    expect(stockDelTarro()).toBe(5)
})

test('Finalizar compra vacía el carrito y deja el stock descontado', async () => {

    //preconfiguracion
    cargarTarroEnElCarrito(2)

    //renderizado del componente
    renderCarrito()

    //interaccion del usuario
    await userEvent.click(screen.getByText('Finalizar compra', { selector: 'button' }))

    //resultados
    expect(window.alert).toHaveBeenCalledWith('¡Compra simulada con éxito!')
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
    expect(stockDelTarro()).toBe(3)
})
