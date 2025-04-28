import React from "react";
import { it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { server } from "./mocks/server";
import Login from "../components/Login";
import "whatwg-fetch"

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("loggar in och visar filmer", async () => {
  render(<Login />);

  fireEvent.change(screen.getByPlaceholderText(/Användarnamn/i), {
    target: { value: "demo" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Lösenord/i), {
    target: { value: "demo" },
  });

  fireEvent.click(screen.getByText(/Logga in/i));

  await waitFor(() => {
    expect(screen.getByText(/Inception/)).toBeInTheDocument();
    expect(screen.getByText(/Interstellar/)).toBeInTheDocument();
  });
});
