export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__contenido">
        <p className="hero__eyebrow">Ferretería de barrio, stock real</p>
        <h1 className="hero__titulo">Lo que necesitas para tu próximo proyecto</h1>
        <p className="hero__texto">
          Pintura y herramientas con precio y stock actualizado.
          Agrega al carrito, retira en tienda o coordina despacho.
        </p>
        <div className="hero__chips">
          <span className="chip">Stock verificado</span>
          <span className="chip">Retiro en tienda</span>
          <span className="chip">Pago seguro</span>
        </div>
      </div>
    </section>
  )
}
