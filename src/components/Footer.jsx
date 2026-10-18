export default function Footer() {
  return (
    <footer className="footer">
      <div className="franja-peligro" aria-hidden="true"></div>
      <div className="footer__contenido">

        <span className="footer__lado">Horario
          <p>Lun a Vie: 9:00 – 18:30 hrs<br />Sáb: 9:30 – 14:00 hrs</p>
        </span>

        <div className="footer__marca">
          <span className="header__logo footer__logo">FERRE<span className="header__logo-acento">TECH</span></span>
          <p>Curso de Desarrollo Web · Proyecto Ferretech</p>
        </div>

        <span className="footer__lado">Ubicación
          <p>Av. Ferretech 482, Santiago</p>
        </span>
      </div>
    </footer>
  )
}
