import React, { useEffect, useState } from "react";
import MovieListDisplay from "./MovieListDisplay";

const PublicMovies = () => {
  return (
    <div className="public-movies">
      <h2>Public Movies</h2>
      <MovieListDisplay />
    </div>
  );
};

export default PublicMovies;