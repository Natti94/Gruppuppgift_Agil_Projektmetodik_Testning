
const BASE_URL = "https://tokenservice-jwt-2025.fly.dev";

let jwtToken = "";

export function setToken(token) {
  jwtToken = token;
}

export function getAuthHeaders() {
  return {
    Authorization: `Bearer ${jwtToken}`,
  };
}

export async function requestToken(username, password) {
  const response = await fetch(`${BASE_URL}/token-service/v1/request-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Kunde inte hämta token: ${response.status} – ${errorText}`
    );
  }

  const token = await response.text();
  setToken(token);
  return token;
}

export async function readToken(id) {
  const response = await fetch(
    `${BASE_URL}/token-service/v1/request-token/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Kunde inte läsa token: ${response.status} – ${errorText}`
    );
  }

  return response.json();
}