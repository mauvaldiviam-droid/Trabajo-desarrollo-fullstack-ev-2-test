import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Register from "../pages/Register";

function renderRegister() {
    return render(
        <MemoryRouter initialEntries={['/ingreso']}>
            <Routes>
                <Route path="/ingreso" element={<Register />} />
                <Route path="/login" element={<h1>Pantalla de login</h1>} />
            </Routes>
        </MemoryRouter>
    )
}

beforeEach(() => {
    localStorage.clear()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
})

afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
})

test('Crea la cuenta, la guarda y lleva al login', async () => {

    //renderizado del componente
    renderRegister()

    //interaccion del usuario
    await userEvent.type(screen.getByPlaceholderText('INGRESE USUARIO'), 'Ana')
    await userEvent.type(screen.getByPlaceholderText('INGRESE CONTRASEÑA'), 'abc')
    await userEvent.click(screen.getByText('Crear usuario', { selector: 'button' }))

    //resultados
    expect(window.alert).toHaveBeenCalledWith('Cuenta creada. Ya puedes iniciar sesión.')
    const usuarios = JSON.parse(localStorage.getItem('usuarios'))
    expect(usuarios.some((u) => u.usuario === 'Ana' && u.contrasena === 'abc')).toBe(true)
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
})

test('Avisa cuando faltan el usuario o la contraseña', async () => {

    //renderizado del componente
    renderRegister()

    //interaccion del usuario
    await userEvent.click(screen.getByText('Crear usuario', { selector: 'button' }))

    //resultados
    expect(window.alert).toHaveBeenCalledWith('Completa usuario y contraseña.')
    expect(screen.queryByText('Pantalla de login')).not.toBeInTheDocument()
})

test('CP-03: Rechaza crear un usuario que ya existe', async () => {

    //renderizado del componente
    renderRegister()

    //interaccion del usuario
    await userEvent.type(screen.getByPlaceholderText('INGRESE USUARIO'), 'Mauricio')
    await userEvent.type(screen.getByPlaceholderText('INGRESE CONTRASEÑA'), 'otra')
    await userEvent.click(screen.getByText('Crear usuario', { selector: 'button' }))

    //resultados
    expect(window.alert).toHaveBeenCalledWith('Ese usuario ya existe, elige otro.')
    expect(JSON.parse(localStorage.getItem('usuarios'))).toHaveLength(1)
    expect(screen.queryByText('Pantalla de login')).not.toBeInTheDocument()
})
