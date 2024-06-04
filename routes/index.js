const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const User = require('../models/user');
const MovieList = require('../models/movieList');

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');

// Check write permissions
const testFilePath = path.join(uploadsDir, 'test.txt');

fs.writeFile(testFilePath, 'Test', (err) => {
  if (err) {
    console.error('No write permission to uploads directory:', err);
  } else {
    console.log('Write permission to uploads directory confirmed.');
    // Delete the test file after checking
    fs.unlink(testFilePath, (err) => {
      if (err) {
        console.error('Error removing test file:', err);
      }
    });
  }
});

// Function to execute a shell command and return it as a Promise
function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
        reject(stderr);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// This route handles adding a movie list
router.post('/add-movie-list', upload.fields([
  { name: 'movieImage', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 },
  { name: 'heroineImage', maxCount: 1 },
  { name: 'directorImage', maxCount: 1 },
  { name: 'musicianImage', maxCount: 1 },
  { name: 'comedianImage', maxCount: 1 },
]), async (req, res) => {
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

  try {
    await newMovieList.save();

    // Execute Git commands to commit and push the changes
    await execShellCommand('git add uploads/');
    await execShellCommand('git commit -m "Add uploaded movie files"');
    await execShellCommand('git push origin main');  // Adjust branch as necessary

    res.json({ message: 'Movie list added and files pushed to GitHub successfully', movieList: newMovieList });
  } catch (error) {
    console.error('Error adding movie list or pushing to GitHub:', error);
    res.status(500).json({ error: 'An error occurred while adding the movie list or pushing to GitHub' });
  }
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
