import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TiendaProvider } from "../context/TiendaContext";
import Catalog from "../components/Catalog";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }))

function renderCatalog(admin = false) {
    return render(
        <TiendaProvider>
            <Catalog admin={admin} />
        </TiendaProvider>
    )
}

function productoGuardado(id) {
    return JSON.parse(localStorage.getItem('productos')).find((p) => p.id === id)
}

beforeEach(() => {
    localStorage.clear()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(window, 'confirm').mockImplementation(() => true)
    vi.spyOn(window, 'prompt').mockImplementation(() => null)
})

afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
})

test('Muestra todos los productos del catálogo', () => {

    //renderizado del componente
    renderCatalog()

    //resultados
    expect(screen.getByText('Catálogo de productos')).toBeInTheDocument()
    expect(screen.getByText('Brocha')).toBeInTheDocument()
    expect(screen.getByText('Tarro de pintura')).toBeInTheDocument()
    expect(screen.getByText('Bolsa de clavos')).toBeInTheDocument()
})

test('El buscador filtra los productos según lo que se escribe', async () => {

    //renderizado del componente
    renderCatalog()

    //interaccion del usuario
    await userEvent.type(screen.getByPlaceholderText('Buscar producto...'), 'broch')

    //resultados
    expect(screen.getByText('Brocha')).toBeInTheDocument()
    expect(screen.queryByText('Tarro de pintura')).not.toBeInTheDocument()
    expect(screen.queryByText('Bolsa de clavos')).not.toBeInTheDocument()
})

test('Muestra un mensaje cuando la búsqueda no tiene resultados', async () => {

    //renderizado del componente
    renderCatalog()

    //interaccion del usuario
    await userEvent.type(screen.getByPlaceholderText('Buscar producto...'), 'zzz')

    //resultados
    expect(screen.getByText('No se encontraron productos.')).toBeInTheDocument()
})

test('Agregar al carrito descuenta el stock y guarda el producto en el carrito', async () => {

    //renderizado del componente
    renderCatalog()

    //interaccion del usuario (el primer botón es el de la Brocha)
    await userEvent.click(screen.getAllByText('Agregar al carrito', { selector: 'button' })[0])

    //resultados
    expect(screen.getByText('En stock (11)')).toBeInTheDocument()
    expect(productoGuardado(1).stock).toBe(11)
    expect(JSON.parse(localStorage.getItem('carrito'))[0].cantidad).toBe(1)
})

test('En modo administrador no se muestra el botón Agregar al carrito', () => {

    //renderizado del componente
    renderCatalog(true)

    //resultados
    expect(screen.queryByText('Agregar al carrito')).not.toBeInTheDocument()
    expect(screen.getAllByText('Editar', { selector: 'button' })).toHaveLength(3)
})

test('El administrador da de baja un producto si lo confirma', async () => {

    //renderizado del componente
    renderCatalog(true)

    //interaccion del usuario
    await userEvent.click(screen.getAllByText('Dar de baja', { selector: 'button' })[0])

    //resultados
    expect(window.confirm).toHaveBeenCalledOnce()
    expect(screen.queryByText('Brocha')).not.toBeInTheDocument()
    expect(screen.getByText('Tarro de pintura')).toBeInTheDocument()
})

test('El administrador no da de baja el producto si cancela la confirmación', async () => {

    //preconfiguracion
    window.confirm.mockReturnValue(false)

    //renderizado del componente
    renderCatalog(true)

    //interaccion del usuario
    await userEvent.click(screen.getAllByText('Dar de baja', { selector: 'button' })[0])

    //resultados
    expect(screen.getByText('Brocha')).toBeInTheDocument()
})

test('El administrador edita el precio y el stock de un producto', async () => {

    //preconfiguracion
    window.prompt.mockReturnValueOnce('1000').mockReturnValueOnce('50')

    //renderizado del componente
    renderCatalog(true)

    //interaccion del usuario
    await userEvent.click(screen.getAllByText('Editar', { selector: 'button' })[0])

    //resultados
    expect(productoGuardado(1).precio).toBe(1000)
    expect(productoGuardado(1).stock).toBe(50)
    expect(screen.getByText('En stock (50)')).toBeInTheDocument()
})

test('Avisa si el precio o el stock editados no son números válidos', async () => {

    //preconfiguracion
    window.prompt.mockReturnValueOnce('abc').mockReturnValueOnce('5')

    //renderizado del componente
    renderCatalog(true)

    //interaccion del usuario
    await userEvent.click(screen.getAllByText('Editar', { selector: 'button' })[0])

    //resultados
    expect(window.alert).toHaveBeenCalledWith('Precio y stock deben ser números válidos (0 o mayores).')
    expect(productoGuardado(1).precio).toBe(5990)
})

test('No cambia nada si el administrador cancela la edición', async () => {

    //renderizado del componente (prompt devuelve null = cancelar)
    renderCatalog(true)

    //interaccion del usuario
    await userEvent.click(screen.getAllByText('Editar', { selector: 'button' })[0])

    //resultados
    expect(productoGuardado(1).precio).toBe(5990)
    expect(productoGuardado(1).stock).toBe(12)
})
