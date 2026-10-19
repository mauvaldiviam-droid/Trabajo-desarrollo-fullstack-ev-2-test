import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }))

function renderEn(ruta) {
    return render(
        <MemoryRouter initialEntries={[ruta]}>
            <App />
        </MemoryRouter>
    )
}

beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
})

afterEach(cleanup)

test('NAV-01: Acceder a / muestra el inicio con el catálogo', () => {

    //renderizado
    renderEn('/')

    //resultados
    expect(screen.getByText(/Lo que necesitas para tu próximo proyecto/)).toBeInTheDocument()
    expect(screen.getByText('Catálogo de productos')).toBeInTheDocument()
    expect(screen.getByText('Brocha')).toBeInTheDocument()
})

test('NAV-02: Acceder a /login muestra el formulario de ingreso', () => {

    //renderizado
    renderEn('/login')

    //resultados
    expect(screen.getByText('INGRESE SU USUARIO')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('INGRESE USUARIO')).toBeInTheDocument()
})

test('NAV-03: Acceder a /admin muestra el panel de administrador', () => {

    //renderizado
    renderEn('/admin')

    //resultados
    expect(screen.getByText('+ Agregar producto')).toBeInTheDocument()
    expect(screen.queryByText('Agregar al carrito')).not.toBeInTheDocument()
    expect(document.body.classList.contains('admin')).toBe(true)
})

test('NAV-05: Acceder a una ruta inexistente redirige al inicio', () => {

    //renderizado
    renderEn('/ruta-que-no-existe')

    //resultados
    expect(screen.getByText('Catálogo de productos')).toBeInTheDocument()
})

test('Acceder a /carrito muestra el carrito', () => {

    //renderizado
    renderEn('/carrito')

    //resultados
    expect(screen.getByText('Tu carrito')).toBeInTheDocument()
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
})

test('Acceder a /ingreso muestra el formulario para crear cuenta', () => {

    //renderizado
    renderEn('/ingreso')

    //resultados
    expect(screen.getByText('Crear usuario', { selector: 'button' })).toBeInTheDocument()
})

test('Acceder a /ingreso-admin muestra el ingreso de administrador', () => {

    //renderizado
    renderEn('/ingreso-admin')

    //resultados
    expect(screen.getByText('Ingresar', { selector: 'button' })).toBeInTheDocument()
})

test('Acceder a /restablecer muestra la recuperación de contraseña', () => {

    //renderizado
    renderEn('/restablecer')

    //resultados
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument()
})

test('Las páginas de acceso solo muestran la marca, sin carrito', () => {

    //renderizado
    renderEn('/login')

    //resultados
    expect(screen.getByText('Herramientas & construcción')).toBeInTheDocument()
    expect(screen.queryByText('Mi cuenta')).not.toBeInTheDocument()
    expect(screen.queryByText('Carrito de compras')).not.toBeInTheDocument()
})

test('Desde el inicio, "Mi cuenta" lleva al login', async () => {

    //renderizado
    renderEn('/')

    //interaccion del usuario
    await userEvent.click(screen.getByText('Mi cuenta'))

    //resultados
    expect(screen.getByText('INGRESE SU USUARIO')).toBeInTheDocument()
})

test('Desde el inicio, agregar un producto actualiza el contador y el carrito', async () => {

    //renderizado
    renderEn('/')

    //interaccion del usuario
    await userEvent.click(screen.getAllByText('Agregar al carrito', { selector: 'button' })[0])
    await userEvent.click(screen.getByRole('link', { name: /Carrito de compras/ }))

    //resultados
    expect(screen.getByText('Tu carrito')).toBeInTheDocument()
    expect(screen.getByText('Brocha')).toBeInTheDocument()
    expect(screen.getByText('$5.990', { selector: '#carrito-total' })).toBeInTheDocument()
})
