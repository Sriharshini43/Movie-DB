import React, { useState, useEffect } from "react";
import axios from "axios";
import { Route, Routes, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Search from "./components/Search";
import CurrentList from "./components/pages/CurrentList";
import MovieDetails from "./components/pages/MovieDetails";
import Loading from "./components/Loading";
import "./index.css";

const App = () => {
  const [activeList, setActiveList] = useState("Trending");
  const [currentArr, setCurrentArr] = useState([]);
  const [activeUrl, setActiveUrl] = useState(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.REACT_APP_API_KEY}`
  );

  const [isLoading, setIsLoading] = useState(false);

  const [searchedMovie, setSearchedMovie] = useState("");
  const [searchResultArr, setSearchResultArr] = useState([]);
  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&query=${searchedMovie}`;

  const [movieId, setMovieId] = useState(0);
  const [movieDetails, setMovieDetails] = useState({
    id: 0,
    title: "",
    overview: "",
    posterPath: "",
    genres: [],
    originalLanguage: "",
    releaseDate: "",
    runtime: "",
    rating: "",
    cast: [],
    director: [],
    productionCompany: "",
    backdropPath: "",
  });
  const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_API_KEY}&append_to_response=credits`;

  const [movieList, setMovieList] = useState([]);

  const getCurrentList = () => {
    axios.get(activeUrl).then((response) => {
      setCurrentArr(response.data.results);
    });
  };

  const fetchSearch = () => {
    axios.get(searchUrl).then((response) => {
      setSearchResultArr(response.data.results);
    });
  };

  const fetchMovieDetails = () => {
    setIsLoading(true);
    axios
      .get(movieDetailsUrl)
      .then((response) => {
        setMovieDetails({
          id: response.data.id,
          title: response.data.title,
          overview: response.data.overview,
          posterPath: response.data.poster_path
            ? `https://image.tmdb.org/t/p/original/${response.data.poster_path}`
            : "",
          genres: response.data.genres.map((genre) => genre.name),
          originalLanguage: response.data.original_language,
          releaseDate: response.data.release_date,
          runtime: response.data.runtime,
          rating: response.data.vote_average,
          cast: response.data.credits.cast.filter(
            (person) => person.known_for_department === "Acting"
          ),
          director: response.data.credits.crew
            .filter((person) => person.known_for_department === "Directing")
            .map((person) => person.name),
          productionCompany:
            response.data.production_companies.length > 0
              ? response.data.production_companies[0].name
              : "",
          backdropPath: response.data.backdrop_path
            ? `https://image.tmdb.org/t/p/original/${response.data.backdrop_path}`
            : "",
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getCurrentList();
  }, [activeList]);

  useEffect(() => {
    if (movieId !== 0) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const addToMovieList = (movie) => {
    setMovieList((prevList) => [...prevList, movie]);
  };

  return (
    <div className="App">
      <Navbar />
      <Search
        searchedMovie={searchedMovie}
        setSearchedMovie={setSearchedMovie}
        fetchSearch={fetchSearch}
      />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Home
              currentArr={currentArr}
              setActiveList={setActiveList}
              setActiveUrl={setActiveUrl}
              setMovieId={setMovieId}
            />
          }
        />
        <Route
          path="/search/movie/query=:query"
          element={
            searchResultArr.length > 0 ? (
              <CurrentList
                currentArr={searchResultArr}
                id={movieId}
                setMovieId={setMovieId}
              />
            ) : (
              <div>
                <div className="back-btn-container">
                  <button className="back-btn">
                    <Link to="/">
                      <i className="fa-solid fa-circle-arrow-left"></i>
                    </Link>
                  </button>
                </div>
                <div className="no-results-div">
                  <h1 className="no-results">No results found</h1>
                </div>
              </div>
            )
          }
        />
        <Route
          path="/movie/:id"
          element={
            isLoading ? (
              <Loading />
            ) : (
              <MovieDetails
                movieDetails={movieDetails}
                addToMovieList={addToMovieList}
                movieList={movieList}
              />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
