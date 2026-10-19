import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { productosIniciales } from "../data/productos";
import ProductCard from "../components/ProductCard";

afterEach(cleanup);

test('Avisa que el usuario agrega el producto al carrito', async () => {

    //preconfiguracion
    const producto = productosIniciales[0]
    const alAgregar = vi.fn()

    //renderizado del componente
    render(<ProductCard producto={producto} onAgregar={alAgregar} />)

    //interaccion del usuario
    await userEvent.click(screen.getByText('Agregar al carrito', { selector: 'button' }))

    //resultados
    expect(alAgregar).toHaveBeenCalledOnce()
    expect(alAgregar).toHaveBeenCalledWith(producto)
})

test('Muestra el nombre, el precio y el stock del producto', () => {

    //preconfiguracion
    const producto = productosIniciales[0]

    //renderizado del componente
    render(<ProductCard producto={producto} onAgregar={vi.fn()} />)

    //resultados
    expect(screen.getByText('Brocha')).toBeInTheDocument()
    expect(screen.getByText('$5.990')).toBeInTheDocument()
    expect(screen.getByText('En stock (12)')).toBeInTheDocument()
})

test('Muestra "Pocas unidades" cuando el stock es menor a 10', () => {

    //preconfiguracion
    const producto = productosIniciales[1]

    //renderizado del componente
    render(<ProductCard producto={producto} onAgregar={vi.fn()} />)

    //resultados
    expect(screen.getByText('Pocas unidades (5)')).toBeInTheDocument()
})

test('Deshabilita el botón cuando el producto no tiene stock', async () => {

    //preconfiguracion
    const sinStock = { ...productosIniciales[0], stock: 0 }
    const alAgregar = vi.fn()

    //renderizado del componente
    render(<ProductCard producto={sinStock} onAgregar={alAgregar} />)

    //interaccion del usuario
    const boton = screen.getByText('Sin stock', { selector: 'button' })
    await userEvent.click(boton)

    //resultados
    expect(boton).toBeDisabled()
    expect(screen.getByText('Agotado (0)')).toBeInTheDocument()
    expect(alAgregar).not.toHaveBeenCalled()
})

test('En modo administrador muestra Editar y Dar de baja en vez de Agregar al carrito', async () => {

    //preconfiguracion
    const producto = productosIniciales[0]
    const alEditar = vi.fn()
    const alDarDeBaja = vi.fn()

    //renderizado del componente
    render(<ProductCard producto={producto} admin onEditar={alEditar} onBaja={alDarDeBaja} />)

    //interaccion del usuario
    await userEvent.click(screen.getByText('Editar', { selector: 'button' }))
    await userEvent.click(screen.getByText('Dar de baja', { selector: 'button' }))

    //resultados
    expect(alEditar).toHaveBeenCalledWith(producto)
    expect(alDarDeBaja).toHaveBeenCalledWith(producto)
    expect(screen.queryByText('Agregar al carrito')).not.toBeInTheDocument()
})
