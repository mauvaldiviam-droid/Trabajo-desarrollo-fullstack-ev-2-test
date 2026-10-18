import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { iniciarSesion, validarLogin } from '../services/auth.js'

export default function Login() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')

  function handleLogin() {
    const encontrado = validarLogin(usuario.trim(), contrasena.trim())

    if (encontrado) {
      iniciarSesion(encontrado)
      navigate('/')
    } else {
      window.alert('Usuario o contraseña incorrectos.')
    }
  }

  return (
    <main>
      <section className="contenedor">
        <div>
          <h2>INGRESE SU USUARIO</h2>
        </div>
        <div className="buscador-usuario">
          <input
            type="text"
            id="usuario-input"
            placeholder="INGRESE USUARIO"
            value={usuario}
            onChange={(evento) => setUsuario(evento.target.value)}
          />
        </div>
        <div className="buscador-contraseña">
          <input
            type="password"
            id="contrasena-input"
            placeholder="INGRESE CONTRASEÑA"
            value={contrasena}
            onChange={(evento) => setContrasena(evento.target.value)}
          />
        </div>
        <div>
          <button className="btn-usuario" id="btn-login" onClick={handleLogin}>
            Ingresar
          </button>
        </div>
        <Link to="/restablecer" className="enlace-restablecer">Restablecer contraseña</Link>{' '}
        <Link to="/ingreso" className="enlace-restablecer">Crear cuenta</Link>{' '}
        <Link to="/ingreso-admin" className="enlace-admin">Ingresar cuenta administrador</Link>
      </section>
    </main>
  )
}
