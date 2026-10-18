import { formatearPrecio, rutaImagen } from '../services/productos.js'

export default function CartItem({ item, onAgregar, onQuitar, onEliminar }) {
  return (
    <div className="carrito-item">
      <div className="carrito-item__imagen">
        <img src={rutaImagen(item.imagen)} alt={item.nombre} />
      </div>
      <div className="carrito-item__info">
        <span>{item.nombre}</span>{' '}
        <button className="btn-restar" onClick={() => onQuitar(item)}>−</button>{' '}
        <span>{item.cantidad}</span>{' '}
        <button className="btn-sumar" onClick={() => onAgregar(item)}>+</button>
      </div>
      <span className="etiqueta-precio">{`$${formatearPrecio(item.precio * item.cantidad)}`}</span>
      <button className="btn-eliminar" onClick={() => onEliminar(item.id)}>Quitar</button>
    </div>
  )
}
