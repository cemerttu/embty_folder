import { useState } from "react";
import "./App.css";

const TMDB_API = "https://api.themoviedb.org/3/search/movie";
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMovies([]);
    try {
      const res = await fetch(
        `${TMDB_API}?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }&query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (data.results) setMovies(data.results);
      else setError("No results found.");
    } catch (err) {
      setError("Failed to fetch movies.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Movie Explorer</h1>
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="movie-grid">
        {movies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            {movie.poster_path ? (
              <img src={`${TMDB_IMG}${movie.poster_path}`} alt={movie.title} />
            ) : (
              <div className="no-image">No Image</div>
            )}
            <div className="movie-info">
              <h2>{movie.title}</h2>
              <p className="year">
                {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
              </p>
              <p className="desc">
                {movie.overview || "No description available."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
