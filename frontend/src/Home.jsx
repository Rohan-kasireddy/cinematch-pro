import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedLang, setSelectedLang] = useState("");
  const [language, setLanguage] = useState("");
  const navigate = useNavigate();

  const genres = ["action", "comedy", "drama", "thriller", "romance", "horror"];
  const isGenreSearch = genres.includes(query.toLowerCase());

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getGenreId = (q) => {
    const map = {
      action: "28",
      comedy: "35",
      drama: "18",
      thriller: "53",
      romance: "10749",
      horror: "27",
    };
    return map[q.toLowerCase()];
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("user");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8080/api/movies/india")
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []))
      .catch(() => setMovies([]));
  }, [navigate]);

  const loadLang = async (lang) => {
    setSelectedLang(lang);

    const res = await fetch(
      `http://localhost:8080/api/movies/language?lang=${lang}`
    );
    const data = await res.json();
    setMovies(data.results || []);
  };

  const search = async () => {
    const genreId = getGenreId(query);

    if (selectedLang && genreId) {
      const res = await fetch(
        `http://localhost:8080/api/movies/filter?genre=${genreId}&lang=${selectedLang}`
      );
      const data = await res.json();
      setMovies(data.results || []);
      return;
    }

    if (genreId) {
      const res = await fetch(
        `http://localhost:8080/api/movies/search?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setMovies(data.results || []);
      return;
    }

    const res = await fetch(
      `http://localhost:8080/api/movies/search?query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    setMovies(data.results || []);
  };

  const filterMovies = async () => {
    if (!isGenreSearch || !language) return;
    const genreId = getGenreId(query);
    const res = await fetch(
      `http://localhost:8080/api/movies/filter?genre=${genreId}&lang=${language}`
    );
    const data = await res.json();
    setMovies(data.results || []);
  };

  return (
    <div className="relative min-h-screen text-white">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1608889175119-7c47d2f3b1b4"
          className="w-full h-full object-cover opacity-40"
          alt="Cinematic background"
        />
      </div>

      <div className="relative z-10 bg-black bg-opacity-60 min-h-screen">
        <div className="p-4 flex justify-between items-center bg-gray-900 bg-opacity-90">
          <h1 className="text-2xl font-bold text-red-500">CineMatch</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col items-center mt-10 px-4">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Find Your Favorite Movies 🎬
          </h2>

          <div className="flex gap-2 flex-col sm:flex-row items-center">
            <input
              className="px-4 py-2 w-80 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="bg-red-600 px-5 py-2 rounded hover:bg-red-700 transition"
              onClick={search}
            >
              Search
            </button>
          </div>

          {!isGenreSearch && (
            <div className="flex gap-4 mt-6 justify-center">
              <button
                onClick={() => loadLang("te")}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Telugu
              </button>
              <button
                onClick={() => loadLang("hi")}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Hindi
              </button>
            </div>
          )}

          {selectedLang && (
            <p className="text-center mt-4 text-gray-400">
              Showing {selectedLang === "te" ? "Telugu" : "Hindi"} Movies
            </p>
          )}

          {isGenreSearch && (
            <div className="flex gap-4 mt-6 justify-center">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-800 p-2 rounded text-white"
              >
                <option value="">Select Language</option>
                <option value="te">Telugu</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
              </select>

              <button
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
                onClick={filterMovies}
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <div className="mt-10 px-4 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8 px-6">
            {movies.length > 0 &&
              movies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="bg-gray-900 rounded overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-full h-72 object-cover"
                  />
                  <h4 className="p-2 text-white">{movie.title}</h4>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
