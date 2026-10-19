import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TiendaProvider } from "../context/TiendaContext";
import AdminProductForm from "../components/AdminProductForm";

function renderForm() {
    return render(
        <TiendaProvider>
            <AdminProductForm />
        </TiendaProvider>
    )
}

beforeEach(() => {
    localStorage.clear()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
})

afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
})

test('Despliega el formulario al presionar "+ Agregar producto"', async () => {

    //renderizado del componente
    renderForm()

    //interaccion del usuario
    await userEvent.click(screen.getByText('+ Agregar producto', { selector: 'button' }))

    //resultados
    expect(screen.getByText('Nuevo producto')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Precio (CLP)')).toBeInTheDocument()
    expect(screen.getByLabelText('Stock')).toBeInTheDocument()
})

test('Guarda un producto nuevo con los valores por defecto de foto y descripción', async () => {

    //renderizado del componente
    renderForm()

    //interaccion del usuario
    await userEvent.click(screen.getByText('+ Agregar producto', { selector: 'button' }))
    await userEvent.type(screen.getByLabelText('Nombre'), 'Taladro')
    await userEvent.type(screen.getByLabelText('Precio (CLP)'), '39990')
    await userEvent.type(screen.getByLabelText('Stock'), '8')
    await userEvent.click(screen.getByText('Guardar producto', { selector: 'button' }))

    //resultados
    const nuevo = JSON.parse(localStorage.getItem('productos')).find((p) => p.nombre === 'Taladro')
    expect(nuevo.id).toBe(4)
    expect(nuevo.precio).toBe(39990)
    expect(nuevo.stock).toBe(8)
    expect(nuevo.imagen).toBe('img/descarga.png')
    expect(nuevo.detalles).toBe('Sin descripción.')
    expect(screen.getByText('+ Agregar producto', { selector: 'button' })).toBeInTheDocument()
})

test('Avisa cuando el nombre queda vacío', async () => {

    //renderizado del componente
    renderForm()

    //interaccion del usuario (el nombre son solo espacios)
    await userEvent.click(screen.getByText('+ Agregar producto', { selector: 'button' }))
    await userEvent.type(screen.getByLabelText('Nombre'), '   ')
    await userEvent.type(screen.getByLabelText('Precio (CLP)'), '100')
    await userEvent.type(screen.getByLabelText('Stock'), '1')
    await userEvent.click(screen.getByText('Guardar producto', { selector: 'button' }))

    //resultados
    expect(window.alert).toHaveBeenCalledWith('Completa nombre, precio y stock con valores válidos.')
    expect(JSON.parse(localStorage.getItem('productos'))).toHaveLength(3)
    expect(screen.getByText('Nuevo producto')).toBeInTheDocument()
})

test('Cancelar cierra el formulario sin guardar nada', async () => {

    //renderizado del componente
    renderForm()

    //interaccion del usuario
    await userEvent.click(screen.getByText('+ Agregar producto', { selector: 'button' }))
    await userEvent.type(screen.getByLabelText('Nombre'), 'Martillo')
    await userEvent.click(screen.getByText('Cancelar', { selector: 'button' }))

    //resultados
    expect(screen.queryByText('Nuevo producto')).not.toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('productos'))).toHaveLength(3)
})
