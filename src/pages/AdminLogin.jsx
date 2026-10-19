import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { iniciarSesion, validarLoginAdmin } from '../services/auth.js'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')

  function handleLogin() {
    const encontrado = validarLoginAdmin(usuario.trim(), contrasena.trim())

    if (encontrado) {
      iniciarSesion(encontrado)
      navigate('/admin')
    } else {
      window.alert('Usuario o contraseña incorrectos.')
    }
  }

  return (
    <main>
      <section className="contenedor">
        <div>
          <h2>INGRESE NOMBRE DE USUARIO y CONTRASEÑA</h2>
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
          <button className="btn-login" id="btn-login-admin" onClick={handleLogin}>
            Ingresar
          </button>
        </div>
      </section>
    </main>
  )
}
