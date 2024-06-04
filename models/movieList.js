const mongoose = require('mongoose');

const MovieListSchema = new mongoose.Schema({
  title: String,
  description: String,
  releaseDate: Date,
  runtime: String,
  rating: String,
  productionCompany: String,
  originalLanguage: String,
  hero: String,
  heroine: String,
  comedian: String,
  director: String,
  musician: String,
  movieImage: String,
  heroImage: String,
  heroineImage: String,
  directorImage: String,
  musicianImage: String,
  comedianImage: String,

  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public' 
  }
});

module.exports = mongoose.model('MovieList', MovieListSchema);
