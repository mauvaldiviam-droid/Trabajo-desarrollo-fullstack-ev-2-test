import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";

function renderAdminLogin() {
    return render(
        <MemoryRouter initialEntries={['/ingreso-admin']}>
            <Routes>
                <Route path="/ingreso-admin" element={<AdminLogin />} />
                <Route path="/admin" element={<h1>Panel de administrador</h1>} />
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

test('Permite ingresar con credenciales de administrador y va al panel', async () => {

    //renderizado del componente
    renderAdminLogin()

    //interaccion del usuario
    await userEvent.type(screen.getByPlaceholderText('INGRESE USUARIO'), 'Admin')
    await userEvent.type(screen.getByPlaceholderText('INGRESE CONTRASEÑA'), '1234')
    await userEvent.click(screen.getByText('Ingresar', { selector: 'button' }))

    //resultados
    expect(screen.getByText('Panel de administrador')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('usuarioActual')).usuario).toBe('Admin')
})

test('Rechaza credenciales de administrador inválidas', async () => {

    //renderizado del componente
    renderAdminLogin()

    //interaccion del usuario
    await userEvent.type(screen.getByPlaceholderText('INGRESE USUARIO'), 'Admin')
    await userEvent.type(screen.getByPlaceholderText('INGRESE CONTRASEÑA'), 'incorrecta')
    await userEvent.click(screen.getByText('Ingresar', { selector: 'button' }))

    //resultados
    expect(window.alert).toHaveBeenCalledWith('Usuario o contraseña incorrectos.')
    expect(localStorage.getItem('usuarioActual')).toBeNull()
})

test('Un cliente no puede ingresar como administrador', async () => {

    //renderizado del componente
    renderAdminLogin()

    //interaccion del usuario
    await userEvent.type(screen.getByPlaceholderText('INGRESE USUARIO'), 'Mauricio')
    await userEvent.type(screen.getByPlaceholderText('INGRESE CONTRASEÑA'), '1234')
    await userEvent.click(screen.getByText('Ingresar', { selector: 'button' }))

    //resultados
    expect(window.alert).toHaveBeenCalledWith('Usuario o contraseña incorrectos.')
    expect(screen.queryByText('Panel de administrador')).not.toBeInTheDocument()
})
