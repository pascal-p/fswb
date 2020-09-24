const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Promotions = require('../models/promotions');
const cors = require('./cors');
const promoRouter = express.Router();
const ctype = 'application/json'

promoRouter.use(bodyParser.json());

// Promotion(s)
promoRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get(cors.cors, (req, resp, next) => {
    Promotions.find({})
      .then((promos) => {
        resp.statusCode = 200;
        resp.json(promos);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin, (req, resp, next) => {
    Promotions.create(req.body)
      .then((promo) => {
        resp.statusCode = 201; // created
        resp.json(promo);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions,
       authenticate.verifyUser,
       authenticate.verifyAdmin, (req, resp, _next) => {
    resp.statusCode = 403;
    resp.end('PUT operation not supported on /promotions');
  })
  .delete(cors.corsWithOptions,
          authenticate.verifyUser,
          authenticate.verifyAdmin, (req, resp, next) => {
    Promotions.deleteMany({})
      .then((response) => {
        resp.statusCode = 200;
        resp.json(response);
      }, (err) => next(err))
      .catch((err) => next(err));
  });


// Single Promotion by promoID
promoRouter.route('/:promoId')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get(cors.cors, (req, resp, next) => {
    Promotions.findById(req.params.promoId)
      .then((promo) => {
        resp.statusCode = 200;
        resp.json(promo);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin, (req, resp, _next) => {
    resp.statusCode = 403;
    resp.end('POST operation not supported on /promotions/'+ req.params.promoId);
  })
  .put(cors.corsWithOptions,
       authenticate.verifyUser,
       authenticate.verifyAdmin, (req, resp, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
      $set: req.body
    }, { new: true })
      .then((promo) => {
        resp.statusCode = 200;
        resp.json(promo);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions,
          authenticate.verifyUser,
          authenticate.verifyAdmin, (req, resp, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
      .then((response) => {
        resp.statusCode = 200;
        resp.json(response);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = promoRouter;
