import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { enviarCodigoRecuperacion, restablecerContrasena } from '../services/auth.js'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState('usuario')
  const [usuario, setUsuario] = useState('')
  const [usuarioRecuperacion, setUsuarioRecuperacion] = useState('')
  const [codigo, setCodigo] = useState('')
  const [contrasena, setContrasena] = useState('')

  function handleEnviarCodigo() {
    const nombre = usuario.trim()
    const resultado = enviarCodigoRecuperacion(nombre)
    window.alert(resultado.mensaje)

    if (resultado.ok) {
      setUsuarioRecuperacion(nombre)
      setPaso('codigo')
    }
  }

  function handleRestablecer() {
    const resultado = restablecerContrasena(codigo.trim(), contrasena.trim())
    window.alert(resultado.mensaje)

    if (resultado.ok) {
      navigate('/login')
    }
  }

  return (
    <main>
      <section className="contenedor">

        {paso === 'usuario' ? (
          <div id="paso-usuario">
            <h2>¿Olvidaste tu contraseña?</h2>
            <p>Ingresa tu nombre de usuario y te enviaremos un código de verificación a tu correo.</p>
            <div className="buscador-usuario">
              <input
                type="text"
                id="usuario-input"
                placeholder="INGRESE USUARIO"
                value={usuario}
                onChange={(evento) => setUsuario(evento.target.value)}
              />
            </div>
            <div>
              <button className="btn-usuario" id="btn-enviar-codigo" onClick={handleEnviarCodigo}>
                Enviar código a mi correo
              </button>
            </div>
          </div>
        ) : (
          <div id="paso-codigo">
            <h2>Verifica tu código</h2>
            <p id="mensaje-correo">
              {`Ingresa el código que enviamos al correo de "${usuarioRecuperacion}" junto con tu nueva contraseña.`}
            </p>
            <div className="buscador-usuario">
              <input
                type="text"
                id="codigo-input"
                placeholder="CÓDIGO DE VERIFICACIÓN"
                value={codigo}
                onChange={(evento) => setCodigo(evento.target.value)}
              />
            </div>
            <div className="buscador-contraseña">
              <input
                type="password"
                id="contrasena-input"
                placeholder="NUEVA CONTRASEÑA"
                value={contrasena}
                onChange={(evento) => setContrasena(evento.target.value)}
              />
            </div>
            <div>
              <button className="btn-usuario" id="btn-restablecer" onClick={handleRestablecer}>
                Restablecer contraseña
              </button>
            </div>
          </div>
        )}

      </section>
    </main>
  )
}
