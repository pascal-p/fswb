const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');
const dishRouter = express.Router();

const ctype = 'application/json'

dishRouter.use(bodyParser.json());

dishRouter.route('/')
  .get((req, resp, next) => {
    Dishes.find({})
      .then((dishes) => {
        resp.statusCode = 200;
        resp.setHeader('Content-Type', ctype);
        resp.json(dishes);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, resp, next) => {
    Dishes.create(req.body)
      .then((dish) => {
        console.log('DEBUG Dish Created ', dish);
        resp.statusCode = 200;
        resp.setHeader('Content-Type', ctype);
        resp.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put((req, resp, next) => {
    resp.statusCode = 403;
    resp.end('PUT operation not supported on /dishes');
  })
  .delete((req, resp, next) => {
    Dishes.deleteOne({})
      .then((response) => {
        resp.statusCode = 200;
        resp.setHeader('Content-Type', ctype);
        resp.json(response);
      }, (err) => next(err))
    .catch((err) => next(err));
  });

dishRouter.route('/:dishId')
  .get((req, resp, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        resp.statusCode = 200;
        resp.setHeader('Content-Type', 'application/json');
        resp.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, resp, next) => {
    resp.statusCode = 403;
    resp.end('POST operation not supported on /dishes/'+ req.params.dishId);
  })
  .put((req, resp, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
      $set: req.body
    }, { new: true })
      .then((dish) => {
        resp.statusCode = 200;
        resp.setHeader('Content-Type', 'application/json');
        resp.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete((req, resp, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then((response) => {
        resp.statusCode = 200;
        resp.setHeader('Content-Type', 'application/json');
        resp.json(response);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = dishRouter;
