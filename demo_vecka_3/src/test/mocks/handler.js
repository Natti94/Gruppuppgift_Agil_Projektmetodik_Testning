import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/token-service/v1/request-token", async ({ request }) => {
    const { username, password } = await request.json();
    if (username === "demo" && password === "demo") {
      return new HttpResponse("mocked-jwt-token", {
        status: 200,
      });
    }
    return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  }),

  http.get("/movies", () => {
    return HttpResponse.json([
      { id: 1, title: "Inception" },
      { id: 2, title: "Interstellar" },
    ]);
  }),
];
