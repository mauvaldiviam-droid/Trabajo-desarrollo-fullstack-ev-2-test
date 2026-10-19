import { afterEach, beforeEach, expect, test, vi } from "vitest";
import {
    cerrarSesion,
    crearUsuario,
    enviarCodigoRecuperacion,
    iniciarSesion,
    obtenerAdmins,
    obtenerUsuarioActual,
    obtenerUsuarios,
    restablecerContrasena,
    validarLogin,
    validarLoginAdmin,
} from "../services/auth";

beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.spyOn(Math, 'random').mockReturnValue(0)
})

afterEach(() => {
    vi.restoreAllMocks()
})

test('existe un usuario cliente y un administrador por defecto', () => {

    //resultados
    expect(obtenerUsuarios()).toEqual([{ usuario: 'Mauricio', contrasena: '1234' }])
    expect(obtenerAdmins()).toEqual([{ usuario: 'Admin', contrasena: '1234' }])
})

test('validarLogin acepta credenciales correctas', () => {

    //resultados
    expect(validarLogin('Mauricio', '1234')).toEqual({ usuario: 'Mauricio', contrasena: '1234' })
})

test('validarLogin rechaza contraseña incorrecta o usuario inexistente', () => {

    //resultados
    expect(validarLogin('Mauricio', 'mala')).toBeUndefined()
    expect(validarLogin('Nadie', '1234')).toBeUndefined()
    expect(validarLogin('', '')).toBeUndefined()
})

test('validarLoginAdmin solo acepta administradores', () => {

    //resultados
    expect(validarLoginAdmin('Admin', '1234')).toBeDefined()
    expect(validarLoginAdmin('Admin', 'mala')).toBeUndefined()
    expect(validarLoginAdmin('Mauricio', '1234')).toBeUndefined()
})

test('la sesión se guarda, se consulta y se cierra', () => {

    //preconfiguracion
    expect(obtenerUsuarioActual()).toBeNull()

    //interaccion
    iniciarSesion({ usuario: 'Mauricio' })

    //resultados
    expect(obtenerUsuarioActual()).toEqual({ usuario: 'Mauricio' })

    //interaccion
    cerrarSesion()

    //resultados
    expect(obtenerUsuarioActual()).toBeNull()
})

test('crearUsuario guarda una cuenta nueva', () => {

    //interaccion
    const resultado = crearUsuario('Ana', 'abc')

    //resultados
    expect(resultado).toEqual({ ok: true, mensaje: 'Cuenta creada. Ya puedes iniciar sesión.' })
    expect(validarLogin('Ana', 'abc')).toBeDefined()
})

test('crearUsuario exige usuario y contraseña', () => {

    //resultados
    expect(crearUsuario('', 'abc')).toEqual({ ok: false, mensaje: 'Completa usuario y contraseña.' })
    expect(crearUsuario('Ana', '')).toEqual({ ok: false, mensaje: 'Completa usuario y contraseña.' })
})

test('crearUsuario rechaza un usuario repetido', () => {

    //resultados
    expect(crearUsuario('Mauricio', 'otra')).toEqual({ ok: false, mensaje: 'Ese usuario ya existe, elige otro.' })
    expect(obtenerUsuarios()).toHaveLength(1)
})

test('enviarCodigoRecuperacion valida el usuario', () => {

    //resultados
    expect(enviarCodigoRecuperacion('')).toEqual({ ok: false, mensaje: 'Ingresa tu nombre de usuario.' })
    expect(enviarCodigoRecuperacion('Nadie')).toEqual({ ok: false, mensaje: 'Ese usuario no existe.' })
})

test('enviarCodigoRecuperacion genera un código de 6 dígitos', () => {

    //interaccion
    const resultado = enviarCodigoRecuperacion('Mauricio')

    //resultados
    expect(resultado.ok).toBe(true)
    expect(resultado.mensaje).toContain('Tu código es: 100000')
})

test('restablecerContrasena exige haber pedido un código antes', () => {

    //resultados
    expect(restablecerContrasena('100000', 'nueva')).toEqual({ ok: false, mensaje: 'Primero solicita un código de verificación.' })
})

test('restablecerContrasena valida código y contraseña', () => {

    //preconfiguracion
    enviarCodigoRecuperacion('Mauricio')

    //resultados
    expect(restablecerContrasena('', 'nueva').mensaje).toBe('Ingresa el código que enviamos a tu correo.')
    expect(restablecerContrasena('999999', 'nueva').mensaje).toBe('El código ingresado no es correcto.')
    expect(restablecerContrasena('100000', '').mensaje).toBe('Ingresa tu nueva contraseña.')
})

test('restablecerContrasena cambia la contraseña con el código correcto', () => {

    //preconfiguracion
    enviarCodigoRecuperacion('Mauricio')

    //interaccion
    const resultado = restablecerContrasena('100000', 'nueva')

    //resultados
    expect(resultado.ok).toBe(true)
    expect(validarLogin('Mauricio', 'nueva')).toBeDefined()
    expect(validarLogin('Mauricio', '1234')).toBeUndefined()
})

test('el código solo sirve una vez', () => {

    //preconfiguracion
    enviarCodigoRecuperacion('Mauricio')
    restablecerContrasena('100000', 'nueva')

    //resultados
    expect(restablecerContrasena('100000', 'otra').mensaje).toBe('Primero solicita un código de verificación.')
})

test('restablecerContrasena avisa si el usuario ya no existe', () => {

    //preconfiguracion
    enviarCodigoRecuperacion('Mauricio')
    localStorage.setItem('usuarios', JSON.stringify([]))

    //resultados
    expect(restablecerContrasena('100000', 'nueva')).toEqual({ ok: false, mensaje: 'Ese usuario ya no existe.' })
})
