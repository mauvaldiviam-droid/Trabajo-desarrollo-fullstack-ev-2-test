import { estadoStock, formatearPrecio, rutaImagen } from '../services/productos.js'

export default function ProductCard({ producto, admin = false, onAgregar, onEditar, onBaja }) {
  const estado = estadoStock(producto.stock)
  const sinStock = producto.stock <= 0

  return (
    <div className="tarjeta">
      <div className="tarjeta__imagen">
        <img src={rutaImagen(producto.imagen)} alt={producto.nombre} />
      </div>
      <div className="tarjeta__cuerpo">
        <h3 className="tarjeta__nombre">{producto.nombre}</h3>
        <span className={`stock ${estado.clase}`}>
          <span className="stock__punto"></span>{`${estado.texto} (${producto.stock})`}
        </span>
        <details className="tarjeta__detalles">
          <summary>Ver detalles</summary>
          <p>{producto.detalles}</p>
        </details>
      </div>
      <div className="tarjeta__pie">
        <span className="etiqueta-precio">{`$${formatearPrecio(producto.precio)}`}</span>
      </div>
      {admin ? (
        <div className="tarjeta__admin-acciones">
          <button className="btn-secundario btn-editar-producto" onClick={() => onEditar(producto)}>Editar</button>
          <button className="btn-eliminar btn-baja-producto" onClick={() => onBaja(producto)}>Dar de baja</button>
        </div>
      ) : (
        <button className="btn-agregar-carrito" disabled={sinStock} onClick={() => onAgregar(producto)}>
          {sinStock ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      )}
    </div>
  )
}
