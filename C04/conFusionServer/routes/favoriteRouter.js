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
const SaveFavorite = (resp, next, favorite) => {
  favorite.save()          // in DB
    .then(() => {
      resp.statusCode = 200;
      resp.json(favorite); // updated
    }, (err) => next(err));
}

const RenderFavorite = (resp, _next, favorite, code=200) => {
  resp.statusCode = code;
  resp.json(favorite);
}

const CreateOrAddFavorite = (req, resp, next) => {
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
        if (toSave) SaveFavorite(resp, next, favorite);
        else RenderFavorite(resp, next, favorite);
      }
      else { // Create as favorite does not exist yet...
        Favorite.create({user: req.user._id, dishes: req.body})
          .then((favorite) => {
            RenderFavorite(resp, next, favorite, 201)
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
        RenderFavorite(resp, next, favorite)
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,
        authenticate.verifyUser,
        (req, resp, next) => { CreateOrAddFavorite(req, resp, next); }
  )
  .delete(cors.corsWithOptions,
          authenticate.verifyUser,
          (req, resp, next) => {
    Favorite.deleteMany({user: {_id: req.user._id}}) // only delete favorite for the Owner
      .then((response) => {
        resp.statusCode = 200;
        resp.json(response);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

//
// Single Favorite given by favoriteId
favoriteRouter.route('/:favoriteId')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get(cors.cors,
       authenticate.verifyUser,
       (req, resp, _next) => {
         resp.statusCode = 403;
         resp.end('GET operation not supported on /favorites/' + req.params.favoriteId);
  })
  .post(cors.corsWithOptions,
        authenticate.verifyUser,
        (req, resp, next) => {
    Favorite.findOne({user: {_id: req.user._id}}) // restricted to Owner of favorite
      .then((favorite) => {
        if (favorite) {
          const favoriteId = req.params.favoriteId;
          if (favorite.dishes.indexOf(favoriteId) === -1) {
            favorite.dishes.push(favoriteId);
            SaveFavorite(resp, next, favorite);
          }
          else RenderFavorite(resp, next, favorite);
        }
        else {
          console.log("DEBUG: no favorite so far... Create one")
          Favorite.create({user: req.user._id, dishes: req.params.favoriteId})
            .then((favorite) => {
              RenderFavorite(resp, next, favorite, 201)
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
          const ix = favorite.dishes.indexOf(req.params.favoriteId);
          if (ix !== -1) { // Found, then remove...
            favorite.dishes.splice(ix, 1); // ...in memory
            SaveFavorite(resp, next, favorite);
          }
          else RenderFavorite(resp, next, favorite);
        }
        else RenderFavorite(resp, next, []);
      }, (err) => next(err))
      .catch((err) => next(err));
  });


module.exports = favoriteRouter;
