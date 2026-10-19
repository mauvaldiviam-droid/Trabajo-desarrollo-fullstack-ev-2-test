import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ResetPassword from "../pages/ResetPassword";

function renderResetPassword() {
    return render(
        <MemoryRouter initialEntries={['/restablecer']}>
            <Routes>
                <Route path="/restablecer" element={<ResetPassword />} />
                <Route path="/login" element={<h1>Pantalla de login</h1>} />
            </Routes>
        </MemoryRouter>
    )
}

async function solicitarCodigo() {
    await userEvent.type(screen.getByPlaceholderText('INGRESE USUARIO'), 'Mauricio')
    await userEvent.click(screen.getByText('Enviar código a mi correo', { selector: 'button' }))
}

beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(Math, 'random').mockReturnValue(0)
})

afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
})

test('Avisa cuando no se ingresa el usuario', async () => {

    //renderizado del componente
    renderResetPassword()

    //interaccion del usuario
    await userEvent.click(screen.getByText('Enviar código a mi correo', { selector: 'button' }))

    //resultados
    expect(window.alert).toHaveBeenCalledWith('Ingresa tu nombre de usuario.')
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument()
})

test('Avisa cuando el usuario no existe', async () => {

    //renderizado del componente
    renderResetPassword()

    //interaccion del usuario
    await userEvent.type(screen.getByPlaceholderText('INGRESE USUARIO'), 'NoExiste')
    await userEvent.click(screen.getByText('Enviar código a mi correo', { selector: 'button' }))

    //resultados
    expect(window.alert).toHaveBeenCalledWith('Ese usuario no existe.')
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument()
})

test('Con un usuario válido pasa al paso del código', async () => {

    //renderizado del componente
    renderResetPassword()

    //interaccion del usuario
    await solicitarCodigo()

    //resultados
    expect(screen.getByText('Verifica tu código')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('CÓDIGO DE VERIFICACIÓN')).toBeInTheDocument()
    expect(window.alert.mock.calls[0][0]).toContain('Tu código es: 100000')
})

test('Restablece la contraseña con el código correcto y vuelve al login', async () => {

    //renderizado del componente
    renderResetPassword()

    //interaccion del usuario
    await solicitarCodigo()
    await userEvent.type(screen.getByPlaceholderText('CÓDIGO DE VERIFICACIÓN'), '100000')
    await userEvent.type(screen.getByPlaceholderText('NUEVA CONTRASEÑA'), 'nueva')
    await userEvent.click(screen.getByText('Restablecer contraseña', { selector: 'button' }))

    //resultados
    expect(window.alert).toHaveBeenLastCalledWith('Contraseña actualizada. Ya puedes iniciar sesión.')
    expect(JSON.parse(localStorage.getItem('usuarios'))[0].contrasena).toBe('nueva')
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
})

test('Rechaza un código de verificación incorrecto', async () => {

    //renderizado del componente
    renderResetPassword()

    //interaccion del usuario
    await solicitarCodigo()
    await userEvent.type(screen.getByPlaceholderText('CÓDIGO DE VERIFICACIÓN'), '999999')
    await userEvent.type(screen.getByPlaceholderText('NUEVA CONTRASEÑA'), 'nueva')
    await userEvent.click(screen.getByText('Restablecer contraseña', { selector: 'button' }))

    //resultados
    expect(window.alert).toHaveBeenLastCalledWith('El código ingresado no es correcto.')
    expect(JSON.parse(localStorage.getItem('usuarios'))[0].contrasena).toBe('1234')
    expect(screen.queryByText('Pantalla de login')).not.toBeInTheDocument()
})
