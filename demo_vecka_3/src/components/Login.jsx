import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      setError(null);
      const res = await fetch("/token-service/v1/request-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Inloggning misslyckades: ${errorText}`);
      }
      const token = await res.text();

      const movieRes = await fetch("/movies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!movieRes.ok) {
        const errorText = await movieRes.text();
        throw new Error(`Kunde inte hämta filmer: ${errorText}`);
      }
      const moviesData = await movieRes.json();
      setMovies(moviesData);
    } catch (error) {
      console.error("Fel:", error.message);
      setError(error.message);
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Användarnamn"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Logga in och hämta filmer</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {movies.map((m) => (
          <li key={m.id}>{m.title}</li>
        ))}
      </ul>
    </>
  );
}
