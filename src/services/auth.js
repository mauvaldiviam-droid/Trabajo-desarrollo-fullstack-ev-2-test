const CLAVE_USUARIOS = 'usuarios'
const CLAVE_ADMIN = 'admin'
const CLAVE_SESION = 'usuarioActual'
const CLAVE_CODIGO = 'codigoRecuperacion'

// --- Usuario ---

export function obtenerUsuarios() {
  const datos = localStorage.getItem(CLAVE_USUARIOS)
  if (datos) return JSON.parse(datos)

  const inicial = [{ usuario: 'Mauricio', contrasena: '1234' }]
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(inicial))
  return inicial
}

export function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
}

// --- Administrador ---

export function obtenerAdmins() {
  const datos = localStorage.getItem(CLAVE_ADMIN)
  if (datos) return JSON.parse(datos)

  const inicial = [{ usuario: 'Admin', contrasena: '1234' }]
  localStorage.setItem(CLAVE_ADMIN, JSON.stringify(inicial))
  return inicial
}

// --- Sesión ---

export function iniciarSesion(usuario) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario))
}

export function obtenerUsuarioActual() {
  const datos = localStorage.getItem(CLAVE_SESION)
  return datos ? JSON.parse(datos) : null
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION)
}

// --- Validacion ---

export function validarLogin(usuario, contrasena) {
  return obtenerUsuarios().find(
    (u) => u.usuario === usuario && u.contrasena === contrasena,
  )
}

export function validarLoginAdmin(usuario, contrasena) {
  return obtenerAdmins().find(
    (u) => u.usuario === usuario && u.contrasena === contrasena,
  )
}

// --- Crear cuenta ---

export function crearUsuario(usuario, contrasena) {
  if (usuario === '' || contrasena === '') {
    return { ok: false, mensaje: 'Completa usuario y contraseña.' }
  }

  const usuarios = obtenerUsuarios()

  const existe = usuarios.find((u) => u.usuario === usuario)
  if (existe) {
    return { ok: false, mensaje: 'Ese usuario ya existe, elige otro.' }
  }

  usuarios.push({ usuario, contrasena })
  guardarUsuarios(usuarios)

  return { ok: true, mensaje: 'Cuenta creada. Ya puedes iniciar sesión.' }
}

// --- Recuperar contraseña ---

export function enviarCodigoRecuperacion(usuario) {
  if (usuario === '') {
    return { ok: false, mensaje: 'Ingresa tu nombre de usuario.' }
  }

  const encontrado = obtenerUsuarios().find((u) => u.usuario === usuario)

  if (!encontrado) {
    return { ok: false, mensaje: 'Ese usuario no existe.' }
  }

  const codigo = Math.floor(100000 + Math.random() * 900000).toString()
  sessionStorage.setItem(CLAVE_CODIGO, JSON.stringify({ usuario, codigo }))

  return {
    ok: true,
    mensaje: `[Simulación de correo]\n\nHemos enviado un código de verificación al correo asociado a "${usuario}".\n\nTu código es: ${codigo}`,
  }
}

export function restablecerContrasena(codigoIngresado, nuevaContrasena) {
  const datosCodigo = sessionStorage.getItem(CLAVE_CODIGO)
  if (!datosCodigo) {
    return { ok: false, mensaje: 'Primero solicita un código de verificación.' }
  }

  const { usuario, codigo } = JSON.parse(datosCodigo)

  if (codigoIngresado === '') {
    return { ok: false, mensaje: 'Ingresa el código que enviamos a tu correo.' }
  }

  if (codigoIngresado !== codigo) {
    return { ok: false, mensaje: 'El código ingresado no es correcto.' }
  }

  if (nuevaContrasena === '') {
    return { ok: false, mensaje: 'Ingresa tu nueva contraseña.' }
  }

  const usuarios = obtenerUsuarios()
  const encontrado = usuarios.find((u) => u.usuario === usuario)

  if (!encontrado) {
    return { ok: false, mensaje: 'Ese usuario ya no existe.' }
  }

  encontrado.contrasena = nuevaContrasena
  guardarUsuarios(usuarios)
  sessionStorage.removeItem(CLAVE_CODIGO)

  return { ok: true, mensaje: 'Contraseña actualizada. Ya puedes iniciar sesión.' }
}
