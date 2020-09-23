const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Leaders = require('../models/leaders');
const leaderRouter = express.Router();
const ctype = 'application/json'

leaderRouter.use(bodyParser.json());

// Leader(s)
leaderRouter.route('/')
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get((req, resp, next) => {
    Leaders.find({})
      .then((leaders) => {
        resp.statusCode = 200;
        resp.json(leaders);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, resp, next) => {
    Leaders.create(req.body)
      .then((leader) => {
        resp.statusCode = 201; // created
        resp.json(leader);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put((req, resp, _next) => {
    resp.statusCode = 403;
    resp.end('PUT operation not supported on /leaders');
  })
  .delete((req, resp, next) => {
    // delete all leader instances
    Leaders.deleteMany({})
      .then((response) => {
        resp.statusCode = 200;
        resp.json(response);
      }, (err) => next(err))
      .catch((err) => next(err));
  });


// Single Leader by leaderId
leaderRouter.route('/:leaderId')
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get((req, resp, next) => {
    Leaders.findById(req.params.leaderId)
      .then((leader) => {
        resp.statusCode = 200;
        resp.json(leader);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, resp, _next) => {
    resp.statusCode = 403;
    resp.end('POST operation not supported on /leaders/'+ req.params.leaderId);
  })
  .put((req, resp, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
      $set: req.body
    }, { new: true })
      .then((leader) => {
        resp.statusCode = 200;
        resp.json(leader);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete((req, resp, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
      .then((response) => {
        resp.statusCode = 200;
        resp.json(response);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = leaderRouter;
