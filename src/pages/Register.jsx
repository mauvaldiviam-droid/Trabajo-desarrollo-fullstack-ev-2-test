import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { crearUsuario } from '../services/auth.js'

export default function Register() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')

  function handleCrear() {
    const resultado = crearUsuario(usuario.trim(), contrasena.trim())
    window.alert(resultado.mensaje)

    if (resultado.ok) {
      navigate('/login')
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
          <button className="btn-usuario" id="btn-crear" onClick={handleCrear}>
            Crear usuario
          </button>
        </div>
      </section>
    </main>
  )
}
