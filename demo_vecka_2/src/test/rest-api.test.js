import { describe, it, expect, beforeAll, beforeEach, afterEach } from "vitest";

const TOKEN_API_URL = "https://tokenservice-jwt-2025.fly.dev/token-service/v1";
const MOVIE_API_URL = "https://tokenservice-jwt-2025.fly.dev/movies";
let jwtToken;
let createdMovie;

describe("GET-tester - förfrågningar till /movies", () => {
  beforeAll(async () => {
    const res = await fetch(`${TOKEN_API_URL}/request-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "AgilaGrupp3",
        password: "AgilaGrupp3",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(
        `Misslyckades med att hämta JWT-token (${res.status}): ${errText}`
      );
    }

    jwtToken = await res.text();
    console.log("JWT-token hämtad:", jwtToken);
  });

  beforeEach(async () => {
    const res = await fetch(`${MOVIE_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        title: "testfilm",
        director: "Natnael Berhane",
        description: "En testfilm för integrationstester",
        productionYear: 2025,
      }),
    });

    console.log("POST /movies status:", res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.error("POST misslyckades:", errText);
      throw new Error(`Kunde inte skapa film (${res.status}): ${errText}`);
    }

    createdMovie = await res.json();
    console.log("Skapad film:", createdMovie);

    if (!createdMovie?.id) {
      throw new Error("Kunde inte skapa film - ID saknas!");
    }
  });

  afterEach(async () => {
    if (createdMovie?.id) {
      const res = await fetch(`${MOVIE_API_URL}/${createdMovie.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      console.log("DELETE-status:", res.status);
    } else {
      console.warn("Ingen film att radera.");
    }
  });

  it("GET /movies - ska returnera status 200 och en lista med exakt en film", async () => {
    const res = await fetch(`${MOVIE_API_URL}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    console.log("GET /movies status:", res.status);
    const data = await res.json();
    console.log("GET /movies svar:", data);

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
  });

  it("GET /movies/:id - ska returnera status 200 och rätt titel", async () => {
    const res = await fetch(`${MOVIE_API_URL}/${createdMovie.id}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    console.log(`GET /movies/${createdMovie.id} status:`, res.status);
    const data = await res.json();
    console.log("GET enskild film:", data);

    expect(res.status).toBe(200);
    expect(data.title).toBe("testfilm");
  });
});
