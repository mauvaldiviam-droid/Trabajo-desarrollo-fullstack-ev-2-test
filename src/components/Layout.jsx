import { Outlet } from 'react-router-dom'
import Footer from './Footer.jsx'
import Header from './Header.jsx'

export default function Layout({ showNav = false }) {
  return (
    <>
      <Header showNav={showNav} />
      <Outlet />
      <Footer />
    </>
  )
}
