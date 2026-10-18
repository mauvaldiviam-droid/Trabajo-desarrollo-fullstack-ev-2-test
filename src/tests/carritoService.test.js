import { describe, expect, it } from "vitest";

// Función auxiliar lógica equivalente al manejo del carrito
function calcularTotalCarrito(items) {
  return items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
}

describe("Servicio y Lógica de Carrito de Compras", () => {
  it("debe calcular el monto total correctamente con múltiples productos", () => {
    const itemsPrueba = [
      { id: 1, precio: 5990, cantidad: 5 },
      { id: 2, precio: 45990, cantidad: 1 }
    ];

    const total = calcularTotalCarrito(itemsPrueba);
    expect(total).toBe(75940);
  });

  it("debe retornar 0 si el carrito está vacío", () => {
    const total = calcularTotalCarrito([]);
    expect(total).toBe(0);
  });
});