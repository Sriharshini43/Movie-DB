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
  movieImage: Buffer,
  heroImage: Buffer,
  heroineImage: Buffer,
  directorImage: Buffer,
  musicianImage: Buffer,
  comedianImage: Buffer,
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public' 
  }
});

module.exports = mongoose.model('MovieList', MovieListSchema);
