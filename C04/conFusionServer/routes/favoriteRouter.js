const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Favorite = require('../models/favorite');
const cors = require('./cors');
const favoriteRouter = express.Router();
const ctype = 'application/json'

favoriteRouter.use(bodyParser.json());

//
// Helper functions
const renderObj = (resp, _next, favorite, code=200) => {
  resp.statusCode = code;
  resp.json(favorite);
}

const populateAndRenderFavorite = (resp, next, favorite, code=200) => {
  Favorite.findById(favorite._id)
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
      renderObj(resp, next, favorite, code);
    }, (err) => next(err))
}

const saveAndRenderFavorite = (resp, next, favorite, code=200) => {
  favorite.save()          // in DB
    .then(() => {
      populateAndRenderFavorite(resp, next, favorite);
    }, (err) => next(err));
}

const createOrAddFavorite = (req, resp, next) => {
  Favorite.findOne({user: {_id: req.user._id}}) // restricted to Owner of favorite
    .then((favorite) => {
      if (favorite) { // Update existing favorite list
        let toSave = false;
        for (const dishId of req.body) {
          if (favorite.dishes.indexOf(dishId._id) === -1) {
            favorite.dishes.push(dishId._id);
            toSave = true;
          }
        }
        if (toSave) saveAndRenderFavorite(resp, next, favorite, 201);
        else populateAndRenderFavorite(resp, next, favorite);
      }
      else { // Create as favorite does not exist yet...
        Favorite.create({user: req.user._id, dishes: req.body})
          .then((favorite) => {
            populateAndRenderFavorite(resp, next, favorite);
          }, (err) => next(err))
          .catch((err) => next(err));
      }
    }, (err) => next(err))
    .catch((err) => next(err));
}


//
// Favorite
favoriteRouter.route('/')
  .options(cors.corsWithOptions, (req, resp) => { resp.sendStatus(200); })
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get(cors.cors,
       authenticate.verifyUser,
       (req, resp, next) => {
    Favorite.find({user: {_id: req.user._id}}) // restricted to Owner of favorite
      .populate('user')
      .populate('dishes')
      .then((favorite) => {
        renderObj(resp, next, favorite)
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,
        authenticate.verifyUser,
        (req, resp, next) => { createOrAddFavorite(req, resp, next); }
  )
  .delete(cors.corsWithOptions,
          authenticate.verifyUser,
          (req, resp, next) => {
    Favorite.deleteMany({user: {_id: req.user._id}}) // only delete favorite for the Owner
      .then((out) => {
        renderObj(resp, next, out);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

//
// Single Favorite given by dishId
favoriteRouter.route('/:dishId')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get(cors.cors,
       authenticate.verifyUser,
       (req, resp, _next) => {
    Favorite.findOne({user: req.user._id})
      .then((favorite) => {
        if (!favorite ||
            favorite.dishes.indexOf(req.params.dishId) < 0) {
          renderObj(resp, next, {"exists": false, "favorites": favorite});
        }
        else {
          renderObj(resp, next, {"exists": true, "favorites": favorite});
        }
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post(cors.corsWithOptions,
        authenticate.verifyUser,
        (req, resp, next) => {
    Favorite.findOne({user: {_id: req.user._id}}) // restricted to Owner of favorite
      .then((favorite) => {
        if (favorite) {
          const dishId = req.params.dishId;
          if (favorite.dishes.indexOf(dishId) < 0) {
            favorite.dishes.push(dishId);
            saveAndRenderFavorite(resp, next, favorite);
          }
          else populateAndRenderFavorite(resp, next, favorite);
        }
        else {
          // no favorite so far => Create one
          Favorite.create({user: req.user._id, dishes: req.params.dishId})
            .then((favorite) => {
              populateAndRenderFavorite(resp, next, favorite)
            }, (err) => next(err))
            .catch((err) => next(err));
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions,
          authenticate.verifyUser,
          (req, resp, next) => {
    Favorite.findOne({user: {_id: req.user._id}})  // restricted to Owner of favorite
      .then((favorite) => {
        if (favorite) {
          const ix = favorite.dishes.indexOf(req.params.dishId);
          if (ix !== -1) { // Found, then remove...
            favorite.dishes.splice(ix, 1); // ...in memory
            saveAndRenderFavorite(resp, next, favorite);
          }
          else populateAndRenderFavorite(resp, next, favorite);
        }
        else renderObj(resp, next, []);
      }, (err) => next(err))
      .catch((err) => next(err));
  });


module.exports = favoriteRouter;
