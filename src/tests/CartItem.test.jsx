import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { productosIniciales } from "../data/productos";
import CartItem from "../components/CartItem";

afterEach(cleanup);

test('Muestra el nombre, la cantidad y el subtotal del producto', () => {

    //preconfiguracion
    const item = { ...productosIniciales[0], cantidad: 2 }

    //renderizado del componente
    render(<CartItem item={item} onAgregar={vi.fn()} onQuitar={vi.fn()} onEliminar={vi.fn()} />)

    //resultados
    expect(screen.getByText('Brocha')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('$11.980')).toBeInTheDocument()
})

test('Avisa que el usuario suma una unidad del producto', async () => {

    //preconfiguracion
    const item = { ...productosIniciales[0], cantidad: 2 }
    const alAgregar = vi.fn()

    //renderizado del componente
    render(<CartItem item={item} onAgregar={alAgregar} onQuitar={vi.fn()} onEliminar={vi.fn()} />)

    //interaccion del usuario
    await userEvent.click(screen.getByText('+', { selector: 'button' }))

    //resultados
    expect(alAgregar).toHaveBeenCalledOnce()
    expect(alAgregar).toHaveBeenCalledWith(item)
})

test('Avisa que el usuario resta una unidad del producto', async () => {

    //preconfiguracion
    const item = { ...productosIniciales[0], cantidad: 2 }
    const alQuitar = vi.fn()

    //renderizado del componente
    render(<CartItem item={item} onAgregar={vi.fn()} onQuitar={alQuitar} onEliminar={vi.fn()} />)

    //interaccion del usuario
    await userEvent.click(screen.getByText('−', { selector: 'button' }))

    //resultados
    expect(alQuitar).toHaveBeenCalledOnce()
    expect(alQuitar).toHaveBeenCalledWith(item)
})

test('Avisa que el usuario quita el producto del carrito', async () => {

    //preconfiguracion
    const item = { ...productosIniciales[0], cantidad: 2 }
    const alEliminar = vi.fn()

    //renderizado del componente
    render(<CartItem item={item} onAgregar={vi.fn()} onQuitar={vi.fn()} onEliminar={alEliminar} />)

    //interaccion del usuario
    await userEvent.click(screen.getByText('Quitar', { selector: 'button' }))

    //resultados
    expect(alEliminar).toHaveBeenCalledOnce()
    expect(alEliminar).toHaveBeenCalledWith(item.id)
})
