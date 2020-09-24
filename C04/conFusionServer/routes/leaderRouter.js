const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Leaders = require('../models/leaders');
const cors = require('./cors');
const leaderRouter = express.Router();
const ctype = 'application/json'

leaderRouter.use(bodyParser.json());

// Leader(s)
leaderRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get(cors.cors, (req, resp, next) => {
    Leaders.find({})
      .then((leaders) => {
        resp.statusCode = 200;
        resp.json(leaders);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyUser, (req, resp, next) => {
    Leaders.create(req.body)
      .then((leader) => {
        resp.statusCode = 201; // created
        resp.json(leader);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions,
       authenticate.verifyUser,
       authenticate.verifyUser, (req, resp, _next) => {
    resp.statusCode = 403;
    resp.end('PUT operation not supported on /leaders');
  })
  .delete(cors.corsWithOptions,
          authenticate.verifyUser,
          authenticate.verifyUser, (req, resp, next) => {
    Leaders.deleteMany({})
      .then((response) => {
        resp.statusCode = 200;
        resp.json(response);
      }, (err) => next(err))
      .catch((err) => next(err));
  });


// Single Leader by leaderId
leaderRouter.route('/:leaderId')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get(cors.cors, (req, resp, next) => {
    Leaders.findById(req.params.leaderId)
      .then((leader) => {
        resp.statusCode = 200;
        resp.json(leader);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyUser, (req, resp, _next) => {
    resp.statusCode = 403;
    resp.end('POST operation not supported on /leaders/'+ req.params.leaderId);
  })
  .put(cors.corsWithOptions,
       authenticate.verifyUser,
       authenticate.verifyUser, (req, resp, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
      $set: req.body
    }, { new: true })
      .then((leader) => {
        resp.statusCode = 200;
        resp.json(leader);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions,
          authenticate.verifyUser,
          authenticate.verifyUser, (req, resp, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
      .then((response) => {
        resp.statusCode = 200;
        resp.json(response);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = leaderRouter;
