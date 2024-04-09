import { useEffect, useRef, useState } from "react";
import './index.css'
import StarRating from "./StarRating";
import { UseMovies } from "./UseMovies";
import { useLocalStorageState } from "./UseLocalStorageState";
import { UseKey } from "./UseKey";
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
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "940f8df"

export default function Appv2() {

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("")
  // const tempquery = "Inception"
  const { movies, isloading, error } = UseMovies(query)
  const [watched, setWatched] = useLocalStorageState([], "watched")
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
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]))
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
  // const [watched, setWatched] = useLocalStorageState()
  // useEffect(function () {
  //   localStorage.setItem("watched", JSON.stringify(watched))
  // }, [watched])


  return (
    <>
      <Navbar>
        <SearchBar query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>
      <Main>
        {/* <Box element={<MovieList movies={movies} />} />
        <Box element={<><WatchedSummary watched={watched} />
          <WatchedMovieList watched={watched} /></>} /> */}
        <PickList>

        </PickList>
        <Box>
          {/* {isloading ? <Loader /> : <MovieList movies={movies} />} */}
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
  const inputEl = useRef(null)

  // useEffect(function () {
  //   function callback(e) {
  //     if (document.activeElement === inputEl.current) return;
  //     if (e.code === "Enter") {
  //       inputEl.current.focus();
  //       setQuery("")
  //     }
  //   }

  //   document.addEventListener("keydown", callback)
  //   return function () {
  //     document.removeEventListener("keydown", callback)
  //   }
  // }, [setQuery])

  UseKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("")
  })


  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputEl}
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
function PickList({ movies }) {
  return (
    <ul className="pick">
      <h1>Top Picks For You</h1>
      {movies?.map((movie) => (
        <Pick />
      ))}
    </ul>
  )
}
function Pick({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt="" />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>{movie.Year}</span>
          <span>{movie.imdbRating}</span>
        </p>
      </div>
    </li>
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

  const countRef = useRef(0)
  useEffect(function () {
    if (ratingbyUser) countRef.current = countRef.current + 1;
  }, [ratingbyUser])

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
  // const [avgRating, setAvgRating] = useState(0)
  function handleAddnew() {
    const newWatchedMovie = {
      imdbID: selectedId, title, year, poster, imdbRating: Number(imdbRating), runtime: Number(runtime.split(" ").at(0)), userRating: ratingbyUser, countRatingDecisions: countRef.current,
    }
    onAddWatched(newWatchedMovie)
    // setAvgRating(Number(imdbRating))
    // setAvgRating((avgrating) => (avgrating + ratingbyUser) / 2)
  }
  // if (imdbRating > 8) {
  //   const [isTop, setIsTop] = useState(true);
  // }
  const isTop = imdbRating > 8;
  console.log(isTop)
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
  UseKey("Escape", onClose)
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
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                <span>{imdbRating} IMDB Rating</span>
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {/* <p>Avg Rating: {avgRating}</p> */}
              {!iswatched ?
                <>
                  <StarRating maxRating={10} size={26} onSetRating={setRatingbyUser} />
                  {ratingbyUser && (<button className="btn-add" onClick={handleAddnew}>+ Add to watchlist</button>)}
                </> :
                <div className="watchedrating">
                  {/* <p>You rated the movie with {watchedUserRating}</p> */}
                  <StarRating maxRating={10} size={25} defaultRating={watchedUserRating} onSetRating={handleRatingChange} />
                </div>
              }

            </div>
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
// function WatchedBox() {
//   
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>

//         </>
//       )}
//     </div>
//   )
// }
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