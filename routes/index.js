const express = require('express');
const router = express.Router();
const User = require('../models/user');
const MovieList = require('../models/movieList');

router.post('/add-movie-list', async (req, res) => {
  try {
    const movieListInfo = req.body;
    const movieList = new MovieList(movieListInfo);

    await movieList.save();
    res.status(201).json({ message: 'Movie list added successfully', movieList });
  } catch (error) {
    console.error('Error adding movie list:', error);
    res.status(500).json({ error: 'An error occurred while adding the movie list' });
  }
});

router.get('/movie-image/:id', async (req, res) => {
  try {
    const movieList = await MovieList.findById(req.params.id);

    if (!movieList || !movieList.movieImage) {
      return res.status(404).json({ error: 'Movie image not found' });
    }

    res.set('Content-Type', 'image/jpeg');
    res.send(movieList.movieImage);
  } catch (error) {
    console.error('Error fetching movie image:', error);
    res.status(500).json({ error: 'An error occurred while fetching movie image' });
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
