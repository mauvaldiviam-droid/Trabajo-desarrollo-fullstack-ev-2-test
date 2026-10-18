import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";

describe("Login Page / Form", () => {
  it("debe renderizar el formulario de acceso correctamente", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const buttons = screen.getAllByRole("button", { name: /ingresar/i });
    expect(buttons[0]).toBeInTheDocument();
  });

  it("debe permitir la interacción básica del formulario de inicio de sesión", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const buttons = screen.getAllByRole("button", { name: /ingresar/i });
    fireEvent.click(buttons[0]);

    expect(buttons[0]).toBeInTheDocument();
  });
});