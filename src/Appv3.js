import { useEffect, useState } from "react";
import './index.css'
import StarRating from "./StarRating";
import YouTube from "react-youtube";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    runtime: 120,
    imdbRating: 8,
    userRating: 7.5,
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
    runtime: 125,
    imdbRating: 8.5,
    userRating: 9,
  },
  {
    imdbID: "tt6751670",
    Title: "Dune",
    Year: "2021",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
    runtime: 140,
    imdbRating: 9,
    userRating: 9,
  },
];
// const Shuffeledwatcheddata = tempWatchedData.sort(() => Math.random() - 0.5);
// const randomdata = Shuffeledwatcheddata[0];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "940f8df"

export default function Appv3() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isloading, setIsloading] = useState(false)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("")

  // const tempquery = "Inception"

  function handleSelect(id) {
    setSelectedId(selectedId => id === selectedId ? null : id)
  }
  function handleClose() {
    setSelectedId(null)
  }
  // function handleCloseWatched(selectedId) {
  //   setSelectedId(selectedId)
  // }
  function handleAddWatchedMovie(movie) {
    setWatched(watched => [...watched, movie])
    handleClose()
  }
  function handledelete(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }
  function handleUpdateWatchedRating(imdbID, newrating) {
    setWatched((prevWatched) =>
      prevWatched.map((movie) =>
        movie.imdbID === imdbID ? { ...movie, userRating: newrating } : movie
      )
    );
  }
  const controller = new AbortController();
  useEffect(function () {
    async function fetchMovies() {
      try {
        setIsloading(true)
        setError("")
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal })
        if (!res.ok) throw new Error("something went wrong")
        const data = await res.json()
        if (data.Response === 'False') throw new Error("Movie not found")
        setMovies(data.Search)
        // console.log(data.Search)

      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err.message)
          setError(err.message)
        }
        setError("")
      } finally {
        setIsloading(false)
      }
    }
    if (query.length < 3) {
      setMovies([])
      setError("")
      return
    }
    handleClose();
    fetchMovies();
    return function () {
      controller.abort();
    }
  }, [query])



  return (
    <>
      <Navbar>
        <SearchBar query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>
      <Main>
        <PickList onSelectMovie={handleSelect} />
        <Box>
          {isloading && <Loader />}
          {!isloading && !error && <MovieList movies={movies} onSelectMovie={handleSelect} />}
          {error && <Errormessage message={error} />}
        </Box>
        <Box>
          {selectedId ? <MovieSelected selectedId={selectedId} onClose={handleClose} onAddWatched={handleAddWatchedMovie} watched={watched} onUpdateWatchedRating={handleUpdateWatchedRating} /> : <>
            <WatchedSummary watched={watched} />
            <WatchedMovieList watched={watched} onDeleteWatchedmovie={handledelete} />
          </>}
        </Box>
      </Main>
    </>
  );
}
function Navbar({ children }) {
  return (
    <>
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
    </>
  )
}
function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}
function Loader() {
  return (
    <div className="loader">Loading....</div>
  )
}
function Errormessage({ message }) {
  return (
    <p className="error">
      <span>✖️</span>{message}
    </p>
  )
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🎞️</span>
      <h1>movieMania</h1>
    </div>
  )
}
function SearchBar({ query, setQuery }) {
  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </>
  )
}
function Main({ children }) {
  return (
    <>
      <main className="main">
        {children}
      </main>
    </>
  )
}

function PickList({ onSelectMovie }) {
  const [randomMovies, setRandomMovies] = useState([]);
  const [pickMovies, setPickMovies] = useState([]);

  useEffect(() => {
    const fetchPickMovies = async () => {
      try {
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=popular`);
        const data = await res.json();
        if (data.Response === 'True') {
          const moviesWithRating = await Promise.all(
            data.Search.map(async (movie) => {
              const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${movie.imdbID}`);
              const movieDetails = await res.json();
              return {
                ...movie,
                imdbRating: movieDetails.imdbRating,
              };
            })
          );
          setPickMovies(moviesWithRating);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchPickMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndices = [];
      while (randomIndices.length < 4) {
        const randomIndex = Math.floor(Math.random() * pickMovies.length);
        if (!randomIndices.includes(randomIndex)) {
          randomIndices.push(randomIndex);
        }
      }
      const newRandomMovies = randomIndices.map((index) => pickMovies[index]);
      setRandomMovies(newRandomMovies);
    }, 5000);

    return () => clearInterval(interval);
  }, [pickMovies]);

  return (
    <ul className="pick list-movies">
      <h1>Top Picks For You</h1>
      {randomMovies?.map((movie) => (
        <Pick movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Pick({ movie, onSelectMovie }) {
  console.log(movie)
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt="" />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>{movie.Year}</span>
          <span>⭐  {movie.imdbRating}</span>
        </p>
      </div>
    </li>
  )
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (
        children
      )}
    </div>
  )
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  )
}
function Movie({ movie, onSelectMovie }) {
  console.log(movie)
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}
function MovieSelected({ selectedId, onClose, onAddWatched, watched, onUpdateWatchedRating }) {
  const [movie, setMovie] = useState({})
  const [isloading, setIsloading] = useState(false)
  const [ratingbyUser, setRatingbyUser] = useState("")
  const [trailerKey, setTrailerKey] = useState(null);
  const iswatched = watched.map((movie) => movie.imdbID).includes(selectedId)
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating, Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre, } = movie;
  useEffect(function () {
    async function showMovieDetails() {
      setIsloading(true)
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)
      const data = await res.json()
      setMovie(data)
      setIsloading(false)
    }
    showMovieDetails()
  }, [selectedId])
  function handleRatingChange(newrating) {
    setRatingbyUser(newrating)
    if (iswatched) {
      onUpdateWatchedRating(selectedId, newrating);
    }
  }

  useEffect(function () {
    if (!title) return;
    document.title = `Movie | ${title}`
    return function () {
      document.title = "Movie"
    }
  }, [title])
  useEffect(
    function () {
      function callback(e) {
        if (e.code === 'Escape') {
          onClose();
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback)
      }
    }, [onClose]
  )
  useEffect(function () {
    async function fetchTrailerKey() {
      try {
        const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${selectedId}/videos?api_key=b1268e4f4bc005e317c5360bedfa992e`);
        if (!tmdbRes.ok) {
          throw new Error("Failed to fetch trailer key");
        }
        const tmdbData = await tmdbRes.json();
        const trailer = tmdbData.results.find((video) => video.type === "Trailer");
        if (!trailer) {
          setTrailerKey(null)
          throw new Error("Trailer not found");
        }
        setTrailerKey(trailer.key);
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    }
    if (selectedId) {
      fetchTrailerKey();
    }
  }, [selectedId])

  function handlePlayTrailer() {
    if (trailerKey) {
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank");
    } else {
      console.log("Trailer not available");
    }
  }
  return (
    <div className="details">
      {isloading ? <Loader /> :
        <>
          <header>
            <button className="btn-back" onClick={onClose}>&larr;</button>
            <img src={poster} alt={`poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              {iswatched && <WatchedSticker />}
              <p>{released} &bull; {runtime}</p>
              <div className="genrentrailer">
                <p>{genre}</p>
                <button className="trailerbtn" onClick={handlePlayTrailer}>Play Trailer</button>
              </div>
              <p>
                <span>⭐</span>
                <span>{imdbRating} IMDB Rating</span>
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!iswatched ?
                <>
                  <StarRating maxRating={10} size={26} onSetRating={setRatingbyUser} />
                  {ratingbyUser && (<button className="btn-add" onClick={() => onAddWatched({
                    imdbID: selectedId, title, year, poster, imdbRating: Number(imdbRating), runtime: Number(runtime.split(" ").at(0)), userRating: ratingbyUser,
                  })}>Add to watchlist</button>)}
                </> :
                <div className="watchedrating">
                  {/* <p>You rated the movie with {watchedUserRating}</p> */}
                  <StarRating maxRating={10} size={25} defaultRating={watchedUserRating} onSetRating={handleRatingChange} />
                </div>
              }

            </div>
            {trailerKey ? (
              <div className="trailer">
                <YouTube videoId={trailerKey} opts={{ width: "100%", height: "300rem" }} />
              </div>
            ) : (<div className="trailer">
              <YouTube videoId={trailerKey} opts={{ width: "100%" }} onError={() => console.error("Error loading YouTube trailer")} />
            </div>)}
            <p>
              <em> {plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </>}
    </div>
  )
}

function WatchedSummary({ watched }) {
  const avgImdbRating = (average(watched.map((movie) => movie.imdbRating))).toFixed(2);
  const avgUserRating = (average(watched.map((movie) => movie.userRating))).toFixed(2);
  const avgRuntime = (average(watched.map((movie) => movie.runtime))).toFixed(2);
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}
function WatchedMovieList({ watched, onDeleteWatchedmovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatchedmovie={onDeleteWatchedmovie} />
      ))}
    </ul>
  )
}
function WatchedSticker() {
  return (
    <div className="sticker">watched</div>
  )
}
function WatchedMovie({ movie, onDeleteWatchedmovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button className="btn-delete" onClick={() => onDeleteWatchedmovie(movie.imdbID)}>❌</button>
    </li>
  )
}