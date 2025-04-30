import {
  beforeAll,
  describe,
  beforeEach,
  afterEach,
  test,
  expect,
} from "vitest";
import { requestToken, setToken, getAuthHeaders } from "../lib/modul";

const BASE_URL = "https://tokenservice-jwt-2025.fly.dev";

beforeAll(async () => {
  const token = await requestToken("AgilaGrupp3", "AgilaGrupp3");
  setToken(token);
});

describe("GET-tester", () => {
  let createdMovie;
  const description = "En spännande sci-fi-film med trettio bokstäver";

  beforeEach(async () => {
    const res = await fetch(`${BASE_URL}/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        title: "Testfilm GET",
        director: "Regissör GET",
        description,
        productionYear: 2023,
      }),
    });

    createdMovie = await res.json();
  });

  afterEach(async () => {
    await fetch(`${BASE_URL}/movies/${createdMovie.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  });

  test("GET /movies returnerar array med minst en film", async () => {
    const res = await fetch(`${BASE_URL}/movies`, {
      headers: getAuthHeaders(),
    });

    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);
  });

  test("GET /movies/:id returnerar korrekt film", async () => {
    const res = await fetch(`${BASE_URL}/movies/${createdMovie.id}`, {
      headers: getAuthHeaders(),
    });

    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.title).toBe("Testfilm GET");
    expect(data.director).toBe("Regissör GET");
    expect(data.description).toBe(description);
    expect(data.productionYear).toBe(2023);
  });
});

describe("DELETE-test", () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch(`${BASE_URL}/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        title: "Testfilm DELETE",
        director: "Regissör DELETE",
        description: "En intressant film att ta bort med trettio bokstäver",
        productionYear: 2022,
      }),
    });

    createdMovie = await res.json();
  });

  test("DELETE /movies/:id returnerar status 204", async () => {
    const res = await fetch(`${BASE_URL}/movies/${createdMovie.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    expect(res.status).toBe(204);
  });
});

describe("POST + DELETE i samma test", () => {
  test("Skapa och ta bort film i samma test", async () => {
    const postRes = await fetch(`${BASE_URL}/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        title: "Post och Delete",
        director: "Regissör POST o DELETE",
        description: "Filmen som skapas och tas bort med trettio bokstäver",
        productionYear: 2024,
      }),
    });

    expect(postRes.status).toBe(201);
    const newMovie = await postRes.json();

    const deleteRes = await fetch(`${BASE_URL}/movies/${newMovie.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    expect(deleteRes.status).toBe(204);
  });
});

describe("PUT + GET", () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch(`${BASE_URL}/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        title: "Originaltitel",
        director: "Regissör med trettio bokstäver",
        description: "En gammal film med trettio bokstäver",
        productionYear: 2021,
      }),
    });

    createdMovie = await res.json();
  });

  afterEach(async () => {
    await fetch(`${BASE_URL}/movies/${createdMovie.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  });

  test("Uppdatera titel och verifiera", async () => {
    const putRes = await fetch(`${BASE_URL}/movies/${createdMovie.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        title: "Uppdaterad titel",
        director: "Regissör med trettio bokstäver",
        description: "En uppdaterad beskrivning med trettio bokstäver",
        productionYear: 2021,
      }),
    });

    expect(putRes.status).toBe(200);

    const updatedMovie = await fetch(`${BASE_URL}/movies/${createdMovie.id}`, {
      headers: getAuthHeaders(),
    }).then((res) => res.json());

    expect(updatedMovie.title).toBe("Uppdaterad titel");
    expect(updatedMovie.director).toBe("Regissör med trettio bokstäver");
    expect(updatedMovie.description).toBe(
      "En uppdaterad beskrivning med trettio bokstäver"
    );
    expect(updatedMovie.productionYear).toBe(2021);
  });
});
