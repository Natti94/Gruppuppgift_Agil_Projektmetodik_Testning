<reference types="vitest" />;
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Counter from "../components/Counter";

describe("Counter-komponent", () => {
  it("visar 0 från början", () => {
    render(<Counter />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("ökar med 1 efter klick", () => {
    render(<Counter />);
    fireEvent.click(screen.getByText("Öka"));
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
