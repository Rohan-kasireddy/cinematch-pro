import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);

  const cast = movie?.credits?.cast?.slice(0, 6) || [];
  const director = movie?.credits?.crew?.find(
    (person) => person.job === "Director"
  );

  useEffect(() => {
    fetch(`http://localhost:8080/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id]);

  useEffect(() => {
    if (!movie) return;
    const language = movie.original_language;
    const genres = movie.genres?.map((g) => g.id).join(",");
    if (!genres) {
      setSimilar([]);
      return;
    }

    fetch(`http://localhost:8080/api/movies/recommend?lang=${language}&genre=${genres}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("RECOMMEND:", data);
        const results = data.results || [];
        if (results.length === 0) {
          fetch("http://localhost:8080/api/movies/india")
            .then((res) => res.json())
            .then((indiaData) => setSimilar(indiaData.results || []))
            .catch(() => setSimilar([]));
        } else {
          setSimilar(results);
        }
      })
      .catch(() => setSimilar([]));
  }, [movie]);

  if (!movie) return <p className="bg-black text-white min-h-screen p-6">Loading...</p>;

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold">{movie.title}</h1>

      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        className="mt-4 w-60"
        alt={movie.title}
      />

      <p className="mt-4">{movie.overview}</p>
      <p className="mt-2">⭐ {movie.vote_average}</p>

      <h2 className="mt-6 text-xl font-bold">Director</h2>
      {director ? (
        <div className="flex items-center gap-4 mt-2">
          {director.profile_path && (
            <img
              src={`https://image.tmdb.org/t/p/w200${director.profile_path}`}
              className="w-16 h-16 rounded-full object-cover"
              alt={director.name}
            />
          )}
          <p>{director.name}</p>
        </div>
      ) : (
        <p className="text-gray-400 mt-2">Director info not available</p>
      )}

      <h2 className="mt-6 text-xl font-bold">Main Cast</h2>
      <div className="flex gap-6 overflow-x-auto mt-4">
        {cast.map((actor) => (
          <div key={actor.id} className="text-center min-w-[120px]">
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                  : "https://via.placeholder.com/100"
              }
              className="w-24 h-24 rounded-full object-cover mx-auto"
              alt={actor.name}
            />
            <p className="mt-2 text-sm font-semibold">{actor.name}</p>
            <p className="text-xs text-gray-400">{actor.character}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-4 text-lg">⭐ Lead Cast</h3>
      <div className="flex gap-6 mt-2">
        {cast.slice(0, 2).map((actor) => (
          <div key={actor.id} className="text-center">
            <img
              src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
              className="w-28 h-28 rounded-full object-cover mx-auto"
              alt={actor.name}
            />
            <p className="mt-2">{actor.name}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-6 text-xl">Available On</h2>
      <p>
        {movie["watch/providers"]?.results?.IN?.flatrate
          ? movie["watch/providers"]?.results?.IN?.flatrate
              .map((p) => p.provider_name)
              .join(", ")
          : "Not Available"}
      </p>

      <h2 className="mt-6 text-xl">Reviews</h2>
      {movie.reviews?.results?.slice(0, 2).map((r) => (
        <div key={r.id} className="bg-gray-800 p-3 mt-2 rounded">
          <p className="font-semibold">{r.author}</p>
          <p>{r.content?.substring(0, 100)}...</p>
        </div>
      ))}

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">More like this</h2>
            <p className="text-gray-400 text-sm">Recommended titles based on this movie</p>
          </div>
        </div>

        {similar.length === 0 ? (
          <p className="text-gray-400 mt-4">No similar movies found</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto mt-4 pb-4">
            {similar.map((movie) => (
              <div
                key={movie.id}
                className="min-w-[150px] bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />
                <p className="p-2 text-sm text-white">{movie.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
