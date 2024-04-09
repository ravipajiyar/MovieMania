import { useState, useEffect } from "react";

export function UseMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isloading, setIsloading] = useState(false)
    const [error, setError] = useState("")
    const KEY = "940f8df"
    useEffect(
        function () {
            const controller = new AbortController();
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
            // handleClose();
            fetchMovies();
            return function () {
                controller.abort();
            }
        }, [query]
    )
    return { movies, isloading, error }
}