import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieListDisplay from "./MovieListDisplay";

const Profile = () => {
  const [movieLists, setMovieLists] = useState([]);

  useEffect(() => {
    // Fetch user's movie lists from backend upon component mount
    axios.get('https://movie-db-up5l.onrender.com/movie-lists', { withCredentials: true })
      .then(response => {
        setMovieLists(response.data);
      })
      .catch(error => {
        console.error("Error fetching movie lists:", error);
      });
  }, []);

  // Log movieLists before rendering MovieListDisplay
  console.log("Movie Lists:", movieLists);

  return (
    <div>
      <MovieListDisplay movieLists={movieLists} />
    </div>
  );
};

export default Profile;
