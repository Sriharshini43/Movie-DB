import React, { useEffect, useState } from "react";

const MovieListDisplay = () => {
  const [movieLists, setMovieLists] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/movie-lists')
      .then(response => response.json())
      .then(data => setMovieLists(data))
      .catch(error => console.error('Error fetching movie lists:', error));
  }, []);

  const styles = {
    container: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px", // Space between the movie list items
    },
    item: {
      backgroundColor: "pink",
      padding: "20px",
      marginBottom: "20px",
      maxWidth: "600px",
      marginLeft: "20px",
      flex: "1", // Allow the items to grow equally
      boxSizing: "border-box",
    },
    movieDetails: {
      display: "flex",
      alignItems: "center",
      marginBottom: "20px",
    },
    castDetails: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
    },
    img: {
      width: "260px", // Increased width for the movie image
      marginRight: "20px",
    },
    castImg: {
      width: "80px",
      marginRight: "20px",
    },
  };

  return (
    <div>
      <h2 style={{ color: "white" }}>Movie Lists</h2>
      {movieLists.length === 0 ? (
        <p>No movie lists found.</p>
      ) : (
        <div style={styles.container}>
          {movieLists.map((list, index) => (
            <div key={index} style={styles.item}>
              <h3>{list.title}</h3>
              <div style={styles.movieDetails}>
                <img src={`http://localhost:3000/${list.movieImage}`} alt="Movie" style={styles.img} />
                <div>
                  <p><strong>Description:</strong> {list.description}</p>
                  <p><strong>Release Date:</strong> {list.releaseDate ? new Date(list.releaseDate).toLocaleDateString() : "Unknown"}</p>
                  <p><strong>Runtime:</strong> {list.runtime || "Unknown"}</p>
                  <p><strong>Rating:</strong> {list.rating || "Unknown"}</p>
                  <p><strong>Production Company:</strong> {list.productionCompany || "Unknown"}</p>
                  <p><strong>Original Language:</strong> {list.originalLanguage || "Unknown"}</p>
                </div>
              </div>
              <div style={{ marginTop: "20px" }}>
                <h4>Cast</h4>
                <div style={styles.castDetails}>
                  <img src={`http://localhost:3000/${list.heroImage}`} alt="Hero" style={styles.castImg} />
                  <p>{list.hero}</p>
                </div>
                <div style={styles.castDetails}>
                  <img src={`http://localhost:3000/${list.heroineImage}`} alt="Heroine" style={styles.castImg} />
                  <p>{list.heroine}</p>
                </div>
                <div style={styles.castDetails}>
                  <img src={`http://localhost:3000/${list.directorImage}`} alt="Director" style={styles.castImg} />
                  <p>{list.director}</p>
                </div>
                <div style={styles.castDetails}>
                  <img src={`http://localhost:3000/${list.musicianImage}`} alt="Musician" style={styles.castImg} />
                  <p>{list.musician}</p>
                </div>
                <div style={styles.castDetails}>
                  <img src={`http://localhost:3000/${list.comedianImage}`} alt="Comedian" style={styles.castImg} />
                  <p>{list.comedian}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieListDisplay;
