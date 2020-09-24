const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Promotions = require('../models/promotions');
const promoRouter = express.Router();
const ctype = 'application/json'

promoRouter.use(bodyParser.json());

// Promotion(s)
promoRouter.route('/')
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get((req, resp, next) => {
    Promotions.find({})
      .then((promos) => {
        resp.statusCode = 200;
        resp.json(promos);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, resp, next) => {
    Promotions.create(req.body)
      .then((promo) => {
        resp.statusCode = 201; // created
        resp.json(promo);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, resp, _next) => {
    resp.statusCode = 403;
    resp.end('PUT operation not supported on /promotions');
  })
  .delete(authenticate.verifyUser, (req, resp, next) => {
    // delete all promotion instances
    Promotions.deleteMany({})
      .then((response) => {
        resp.statusCode = 200;
        resp.json(response);
      }, (err) => next(err))
      .catch((err) => next(err));
  });


// Single Promotion by promoID
promoRouter.route('/:promoId')
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get((req, resp, next) => {
    Promotions.findById(req.params.promoId)
      .then((promo) => {
        resp.statusCode = 200;
        resp.json(promo);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, resp, _next) => {
    resp.statusCode = 403;
    resp.end('POST operation not supported on /promotions/'+ req.params.promoId);
  })
  .put(authenticate.verifyUser, (req, resp, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
      $set: req.body
    }, { new: true })
      .then((promo) => {
        resp.statusCode = 200;
        resp.json(promo);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, resp, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
      .then((response) => {
        resp.statusCode = 200;
        resp.json(response);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = promoRouter;
