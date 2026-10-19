import { afterEach, beforeEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { productosIniciales } from "../data/productos";
import { TiendaProvider } from "../context/TiendaContext";
import Header from "../components/Header";

function renderHeader(showNav = true) {
    return render(
        <MemoryRouter initialEntries={['/']}>
            <TiendaProvider>
                <Routes>
                    <Route path="/" element={<Header showNav={showNav} />} />
                    <Route path="/login" element={<h1>Pantalla de login</h1>} />
                    <Route path="/carrito" element={<h1>Pantalla del carrito</h1>} />
                </Routes>
            </TiendaProvider>
        </MemoryRouter>
    )
}

beforeEach(() => {
    localStorage.clear()
})

afterEach(cleanup)

test('Muestra la marca y el menú cuando showNav está activo', () => {

    //renderizado del componente
    renderHeader(true)

    //resultados
    expect(screen.getByText('Herramientas & construcción')).toBeInTheDocument()
    expect(screen.getByText('Mi cuenta')).toBeInTheDocument()
    expect(screen.getByText('Carrito de compras')).toBeInTheDocument()
})

test('No muestra el menú cuando showNav está apagado', () => {

    //renderizado del componente
    renderHeader(false)

    //resultados
    expect(screen.getByText('Herramientas & construcción')).toBeInTheDocument()
    expect(screen.queryByText('Mi cuenta')).not.toBeInTheDocument()
    expect(screen.queryByText('Carrito de compras')).not.toBeInTheDocument()
})

test('El contador del carrito suma las unidades guardadas', () => {

    //preconfiguracion
    const carrito = [
        { ...productosIniciales[0], cantidad: 2 },
        { ...productosIniciales[1], cantidad: 1 },
    ]
    localStorage.setItem('carrito', JSON.stringify(carrito))

    //renderizado del componente
    renderHeader()

    //resultados
    expect(screen.getByText('3')).toBeInTheDocument()
})

test('Navega a la pantalla de login al presionar "Mi cuenta"', async () => {

    //renderizado del componente
    renderHeader()

    //interaccion del usuario
    await userEvent.click(screen.getByText('Mi cuenta'))

    //resultados
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
})

test('Navega al carrito al presionar el ícono del carrito', async () => {

    //renderizado del componente
    renderHeader()

    //interaccion del usuario
    await userEvent.click(screen.getByRole('link', { name: /Carrito de compras/ }))

    //resultados
    expect(screen.getByText('Pantalla del carrito')).toBeInTheDocument()
})
