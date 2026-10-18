import { useEffect } from 'react'
import AdminProductForm from '../components/AdminProductForm.jsx'
import Catalog from '../components/Catalog.jsx'
import Hero from '../components/Hero.jsx'

export default function AdminHome() {
  useEffect(() => {
    document.body.classList.add('admin')
    return () => document.body.classList.remove('admin')
  }, [])

  return (
    <>
      <Hero />
      <main>
        <Catalog admin>
          <AdminProductForm />
        </Catalog>
      </main>
    </>
  )
}
