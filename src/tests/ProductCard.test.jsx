import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProductCard from "../components/ProductCard";

describe("ProductCard Component", () => {
  const mockProducto = {
    id: 1,
    nombre: "Brocha",
    precio: 5990,
    stock: 5,
    imagen: "/img/descarga.png"
  };

  it("debe mostrar el nombre y el precio del producto correctamente", () => {
    render(<ProductCard producto={mockProducto} onAgregar={() => {}} />);

    expect(screen.getByText("Brocha")).toBeInTheDocument();
    expect(screen.getByText(/\$5\.990/i)).toBeInTheDocument();
  });

  it("debe renderizar el botón de agregar al carrito", () => {
    render(<ProductCard producto={mockProducto} onAgregar={() => {}} />);

    const addButtons = screen.getAllByRole("button", { name: /agregar al carrito/i });
    expect(addButtons[0]).toBeInTheDocument();
    fireEvent.click(addButtons[0]);
  });
});