const express = require('express');
const multer = require('multer');
const router = express.Router();
const User = require('../models/user');
const MovieList = require('../models/movieList'); 

router.get('/', function (req, res, next) {
  return res.render('index.ejs');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get('/', function (req, res, next) {
  return res.render('index.ejs');
});

// This route handles fetching movie lists
router.get('/movie-lists', (req, res) => {
  MovieList.find()
    .select('title description releaseDate runtime rating productionCompany originalLanguage hero heroine comedian director musician movieImage heroImage heroineImage directorImage musicianImage comedianImage visibility')
    .then(movieLists => {
      movieLists.forEach(movie => {
        movie.movieImage = encodeURI(movie.movieImage);
        movie.heroImage = encodeURI(movie.heroImage);
        movie.heroineImage = encodeURI(movie.heroineImage);
        movie.directorImage = encodeURI(movie.directorImage);
        movie.musicianImage = encodeURI(movie.musicianImage);
        movie.comedianImage = encodeURI(movie.comedianImage);
      });
      res.json(movieLists);
    })
    .catch(err => {
      console.error('Error fetching movie lists:', err);
      res.status(500).json({ error: 'An error occurred while fetching movie lists' });
    });
});

router.get('/public-movies', (req, res) => {
  MovieList.find({ visibility: 'public' })
    .then(publicMovies => {
      res.json(publicMovies);
    })
    .catch(err => {
      console.error('Error fetching public movies:', err);
      res.status(500).json({ error: 'An error occurred while fetching public movies' });
    });
});

// This route handles adding a movie list
router.post('/add-movie-list', upload.fields([
  { name: 'movieImage', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 },
  { name: 'heroineImage', maxCount: 1 },
  { name: 'directorImage', maxCount: 1 },
  { name: 'musicianImage', maxCount: 1 },
  { name: 'comedianImage', maxCount: 1 },
]), (req, res) => {
  const movieListInfo = req.body;
  const files = req.files;

  const correctedFiles = {
    movieImage: files.movieImage[0].path.replace(/\\/g, '/'),
    heroImage: files.heroImage[0].path.replace(/\\/g, '/'),
    heroineImage: files.heroineImage[0].path.replace(/\\/g, '/'),
    directorImage: files.directorImage[0].path.replace(/\\/g, '/'),
    musicianImage: files.musicianImage[0].path.replace(/\\/g, '/'),
    comedianImage: files.comedianImage[0].path.replace(/\\/g, '/')
  };
  
  const newMovieList = new MovieList({
    title: movieListInfo.title,
    description: movieListInfo.description,
    releaseDate: movieListInfo.releaseDate,
    runtime: movieListInfo.runtime,
    rating: movieListInfo.rating,
    productionCompany: movieListInfo.productionCompany,
    originalLanguage: movieListInfo.originalLanguage,
    hero: movieListInfo.hero,
    heroine: movieListInfo.heroine,
    comedian: movieListInfo.comedian,
    director: movieListInfo.director,
    musician: movieListInfo.musician,
    movieImage: correctedFiles.movieImage,
    heroImage: correctedFiles.heroImage,
    heroineImage: correctedFiles.heroineImage,
    directorImage: correctedFiles.directorImage,
    musicianImage: correctedFiles.musicianImage,
    comedianImage: correctedFiles.comedianImage,
    visibility: movieListInfo.visibility
  });

  newMovieList.save()
    .then(movieList => {
      res.json({ message: 'Movie list added successfully', movieList });
    })
    .catch(err => {
      console.error('Error adding movie list:', err);
      res.status(500).json({ error: 'An error occurred while adding the movie list' });
    });
});

router.post('/', function (req, res, next) {
  const personInfo = req.body;

  if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
    res.send();
  } else {
    if (personInfo.password === personInfo.passwordConf) {
      User.findOne({email: personInfo.email}, function(err, data) {
        if (!data) {
          var c;
          User.findOne({}, function(err, data) {
            if (data) {
              c = data.unique_id + 1;
            } else {
              c = 1;
            }

            const newPerson = new User({
              unique_id: c,
              email: personInfo.email,
              username: personInfo.username,
              password: personInfo.password,
              passwordConf: personInfo.passwordConf
            });

            newPerson.save(function(err, Person) {
              if (err)
                console.log(err);
              else
                console.log('Success');
            });
          }).sort({_id: -1}).limit(1);
          res.send({"Success":"You are registered, You can login now."});
        } else {
          res.send({"Success":"Email is already used."});
        }
      });
    } else {
      res.send({"Success":"password is not matched"});
    }
  }
});

router.get('/login', function (req, res, next) {
  return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
  User.findOne({email: req.body.email}, function(err, data) {
    if (data) {
      if (data.password === req.body.password) {
        req.session.userId = data.unique_id;
        res.send({"Success":"Success!", "username": data.username});
      } else {
        res.send({"Success":"Wrong password!"});
      }
    } else {
      res.send({"Success":"This Email Is not registered!"});
    }
  });
});

router.get('/logout', function (req, res, next) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

router.get('/forgetpass', function (req, res, next) {
  res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
  User.findOne({email:req.body.email}, function(err, data) {
    if(!data) {
      res.send({"Success":"This Email Is not registered!"});
    } else {
      if (req.body.password === req.body.passwordConf) {
        data.password = req.body.password;
        data.passwordConf = req.body.passwordConf;

        data.save(function(err, Person) {
          if (err)
            console.log(err);
          else
            console.log('Success');
            res.send({"Success":"Password changed!"});
        });
      } else {
        res.send({"Success":"Password does not matched! Both Password should be same."});
      }
    }
  });  
});

module.exports = router;