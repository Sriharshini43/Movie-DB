import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ISO6391 from "iso-639-1";
import { FaCheck } from "react-icons/fa"; // Import FontAwesome check icon

const MovieDetails = ({ movieDetails, movieList }) => {
  const [addedToProfile, setAddedToProfile] = useState(false);

  useEffect(() => {
    const isMovieAdded = movieList.some((movie) => movie.id === movieDetails.id);
    setAddedToProfile(isMovieAdded);
  }, [movieList, movieDetails]);

  const trimInfo = (str, endIndex) => str.substring(0, endIndex);

  const filterDirector = (directorArr) => {
    for (let i = 0; i < directorArr.length; i++) {
      if (directorArr[i] !== undefined) {
        return directorArr[i];
      }
    }
  };

  const getHours = (runtime) => Math.floor(runtime / 60);
  const getMins = (runtime) => runtime % 60;
  const getLanguageFullName = (languageCode) => ISO6391.getName(languageCode);

  const styles = {
    successText: {
      display: "inline-block",
      verticalAlign: "middle",
      marginRight: "10px",
      color: "#32CD32",
    },
    successIcon: {
      verticalAlign: "middle",
    },
  };

  return (
    <div className="movie-details-container">
      <div className="back-btn-container">
        <button className="back-btn">
          <Link to="/">
            <i className="fa-solid fa-circle-arrow-left"></i>
          </Link>
        </button>
      </div>
      <div className="movie-details-inner">
        <div className="poster-container">
          <img
            src={`https://image.tmdb.org/t/p/original/${movieDetails.posterPath}`}
            alt="movie-poster"
            className="movie-poster"
          />
        </div>
        <div className="detail-container">
          <h1 className="movie-title">{movieDetails.title}</h1>
          <span className="year-and-genre">
            {trimInfo(movieDetails.releaseDate, 4)} | {movieDetails.genres.join(", ")}
          </span>
          <h3 className="overview-title">Overview</h3>
          <p className="overview">{movieDetails.overview}</p>
          <p>
            Rating: <span className="rating">{movieDetails.rating}</span>
          </p>
          <p className="release-date">
            Release date: <span>{movieDetails.releaseDate}</span>
          </p>
          <p className="director">
            Directed by: <span>{filterDirector(movieDetails.director)}</span>
          </p>
          <p className="producer">
            Produced by: <span>{movieDetails.productionCompany}</span>
          </p>
          <p className="runtime">
            Runtime: <span>{getHours(movieDetails.runtime)}h {getMins(movieDetails.runtime)}m</span>
          </p>
          <p className="original-lang">
            Original Language: <span>{getLanguageFullName(movieDetails.originalLanguage)}</span>
          </p>
          {addedToProfile && (
            <p style={styles.successText}>
              Added Successfully <FaCheck style={styles.successIcon} />
            </p>
          )}
        </div>
      </div>
      <div className="cast-container">
        <h2 className="cast-title">Cast</h2>
        <div className="actor-container">
          {movieDetails.cast
            .filter((actor) => actor.profile_path)
            .map((actor) => (
              <div className="actor-card" key={actor.id}>
                <img
                  src={`https://image.tmdb.org/t/p/original/${actor.profile_path}`}
                  alt="actor-thumbnail"
                  className="actor-img"
                />
                <h3 className="actor-name">{actor.name}</h3>
                <p className="character">{actor.character}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
