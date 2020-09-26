const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const Dishes = require('../models/dishes');
const cors = require('./cors');
const dishRouter = express.Router();
const ctype = 'application/json'

dishRouter.use(bodyParser.json());

//
// Helper function
const renderObj = (resp, _next, dish, code=200) => {
  resp.statusCode = code;
  resp.json(dish);
}


//
// Dishes
dishRouter.route('/')
  .options(cors.corsWithOptions, (req, resp) => { resp.sendStatus(200); })
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get(cors.cors, (req, resp, next) => {
    Dishes.find(req.query)  // retrieve all dishes here...
      .populate('comments.author')
      .then((dish) => {
        renderObj(resp, next, dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin, (req, resp, next) => {
    Dishes.create(req.body)
      .then((dish) => {
        renderObj(resp, next, dish, 201);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions,
       authenticate.verifyUser,
       authenticate.verifyAdmin, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end('PUT operation not supported on /dishes');
  })
  .delete(cors.corsWithOptions,
          authenticate.verifyUser,
          authenticate.verifyAdmin, (req, resp, next) => {
    Dishes.deleteMany({})
      .then((out) => {
        renderObj(resp, next, out);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

// Single Dish given by dishId
dishRouter.route('/:dishId')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get(cors.cors, (req, resp, next) => {
    Dishes.findById(req.params.dishId)
      .populate('comments.author')
      .then((dish) => {
        renderObj(resp, next, dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end('POST operation not supported on /dishes/'+ req.params.dishId);
  })
  .put(cors.corsWithOptions,
       authenticate.verifyUser,
       authenticate.verifyAdmin, (req, resp, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
      $set: req.body
    }, { new: true })
      .then((dish) => {
        renderObj(resp, next, dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions,
          authenticate.verifyUser,
          authenticate.verifyAdmin, (req, resp, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then((out) => {
        renderObj(resp, next, out);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = dishRouter;
