import React from "react";
import MovieCard from "../MovieCard";

const CurrentList = (props) => {
  // Filter movies to only include those with a valid poster_path
  const moviesWithImages = props.currentArr.filter(movie => movie.poster_path);

  return (
    <div className="current-list-container">
      <div className="current-list-movies">
        {moviesWithImages.map((movie) => {
          return (
            <MovieCard
              key={movie.id}
              id={movie.id}
              poster={movie.poster_path}
              setMovieId={props.setMovieId}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CurrentList;
