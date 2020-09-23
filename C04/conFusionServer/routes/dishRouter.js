const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');
const dishRouter = express.Router();
const ctype = 'application/json'

dishRouter.use(bodyParser.json());

// Dishes
dishRouter.route('/')
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get((req, resp, next) => {
    Dishes.find({})
      .then((dishes) => {
        resp.statusCode = 200;
        resp.json(dishes);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, resp, next) => {
    Dishes.create(req.body)
      .then((dish) => {
        resp.statusCode = 201;
        resp.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put((req, resp, next) => {
    resp.statusCode = 403;
    resp.end('PUT operation not supported on /dishes');
  })
  .delete((req, resp, next) => {
    // delete all dishes
    Dishes.deleteMany({})
      .then((response) => {
        resp.statusCode = 200;
        resp.json(response);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

// Single Dish given by dishId
dishRouter.route('/:dishId')
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get((req, resp, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        resp.statusCode = 200;
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
        resp.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete((req, resp, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then((response) => {
        resp.statusCode = 200;
        resp.json(response);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

// Single Dish embedded Comments
dishRouter.route('/:dishId/comments')
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get((req, resp, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish) { // truthy...
          resp.statusCode = 200;
          resp.json(dish.comments);
        }
        else {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, resp, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        console.log("POST on dish ", dish);
        if (dish) {
          dish.comments.push(req.body);
          dish.save()
            .then((dish) => {
              resp.statusCode = 200;
              resp.json(dish);
            }, (err) => next(err));
        }
        else {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put((req, resp, next) => {
    resp.statusCode = 403;
    resp.end('PUT operation not supported on /dishes/'
            + req.params.dishId + '/comments');
  })
  .delete((req, resp, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish) {
          for (let i = (dish.comments.length - 1); i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).remove();
          }
          dish.save()
            .then((dish) => {
              resp.statusCode = 200;
              resp.json(dish);
            }, (err) => next(err));
        }
        else {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  });

// Single Dish / Single comment
dishRouter.route('/:dishId/comments/:commentId')
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get((req, resp, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          resp.statusCode = 200;
          resp.json(dish.comments.id(req.params.commentId));
        }
        else if (!dish) { // falsey
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
        }
        else {
          err = new Error('Comment ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, resp, next) => {
    resp.statusCode = 403;
    resp.end('POST operation not supported on /dishes/'+ req.params.dishId
            + '/comments/' + req.params.commentId);
  })
  .put((req, resp, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish  && dish.comments.id(req.params.commentId)) { // truthy
          // Allow update of rating
          if (req.body.rating) {
            dish.comments.id(req.params.commentId).rating = req.body.rating;
          }
          // Allow update of comment
          if (req.body.comment) {
            dish.comments.id(req.params.commentId).comment = req.body.comment;
          }
          dish.save()
            .then((dish) => {
              resp.statusCode = 200;
              resp.json(dish);
            }, (err) => next(err));
        }
        else if (!dish) {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
        }
        else {
          err = new Error('Comment ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete((req, resp, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish && dish.comments.id(req.params.commentId)) {
          dish.comments.id(req.params.commentId).remove();
          dish.save()
            .then((dish) => {
              resp.statusCode = 200;
              resp.json(dish);
            }, (err) => next(err));
        }
        else if (!dish) {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
        }
        else {
          err = new Error('Comment ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  });


module.exports = dishRouter;
