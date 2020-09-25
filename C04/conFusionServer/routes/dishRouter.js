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
// helper functions
//
const hasCommentAndIsOwner = (req, dish, cId) => {
  // there is a comment and req.user is the owner of this comment...
  return dish.comments && dish.comments.id(cId) &&
    req.user._id.equals(dish.comments.id(cId).author);
}

const hasCommentAndIsNotOwner = (req, dish, cId) => {
  // there is a comment and req.user is NOT the owner of this comment...
  return dish.comments && dish.comments.id(cId) &&
    !req.user._id.equals(dish.comments.id(cId).author);
}

const errorDishNotFound = (dishId) => {
  let err = new Error('Dish ' + dishId + ' not found');
  err.status = 404;
  return err;
}

const errorCommentNotFound = (cId) => {
  let err = new Error('Comment ' + cId + ' not found');
  err.status = 404;
  return err;
}

const errorNotCommentOwner = () => {
  let err = new Error('Not owner(author) of this comment');
  err.status = 403;
  return err;
}


// Dishes
dishRouter.route('/')
  .options(cors.corsWithOptions, (req, resp) => { resp.sendStatus(200); })
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get(cors.cors, (req, resp, next) => {
    Dishes.find()  // retrieve all dishes here...
      .populate('comments.author')
      .then((dish) => {
        resp.statusCode = 200;
        resp.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin, (req, resp, next) => {
    Dishes.create(req.body)
      .then((dish) => {
        resp.statusCode = 201;
        resp.json(dish);
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
      .then((response) => {
        resp.statusCode = 200;
        resp.json(response);
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
        resp.statusCode = 200;
        resp.json(dish);
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
        resp.statusCode = 200;
        resp.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions,
          authenticate.verifyUser,
          authenticate.verifyAdmin, (req, resp, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then((response) => {
        resp.statusCode = 200;
        resp.json(response);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

// Single Dish embedded Comments
dishRouter.route('/:dishId/comments')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get(cors.cors, (req, resp, next) => {
    Dishes.findById(req.params.dishId)
      .populate('comments.author')
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
  .post(cors.corsWithOptions,
        authenticate.verifyUser, (req, resp, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        console.log("POST on dish ", dish);
        if (dish) {
          req.body.author = req.user._id;
          dish.comments.push(req.body);
          dish.save()
            .then((dish) => {
              Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                  resp.statusCode = 200;
                  resp.json(dish);
                })
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
  .put(cors.corsWithOptions,
       authenticate.verifyUser, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end('PUT operation not supported on /dishes/'
            + req.params.dishId + '/comments');
  })
  .delete(cors.corsWithOptions,
          authenticate.verifyUser,
          authenticate.verifyAdmin, (req, resp, next) => {
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
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get(cors.cors, (req, resp, next) => {
    Dishes.findById(req.params.dishId)
      .populate('comments.author')
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
  .post(cors.corsWithOptions,
        authenticate.verifyUser, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end('POST operation not supported on /dishes/'+ req.params.dishId
            + '/comments/' + req.params.commentId);
  })
  .put(cors.corsWithOptions,
       authenticate.verifyUser, (req, resp, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        const cId = req.params.commentId;
        if (dish && hasCommentAndIsOwner(req, dish, cId)) {
          // Allow update of rating for owner(author) of the comments
          if (req.body.rating) {
            dish.comments.id(cId).rating = req.body.rating;
          }
          // Allow update of comment for owner(author) of the comments
          if (req.body.comment) {
            dish.comments.id(cId).comment = req.body.comment;
          }
          dish.save()
            .then((dish) => {
              Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                  resp.statusCode = 200;
                  resp.json(dish);
                })
            }, (err) => next(err));
        }
        else if (!dish) {
          return next(errorDishNotFound(req.params.dishId));
        }
        else if (hasCommentAndIsNotOwner(req, dish, cId)) {
          return next(errorNotCommentOwner());
        }
        else {
          return next(errorCommentNotFound(cId));
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions,
          authenticate.verifyUser, (req, resp, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        const cId = req.params.commentId;
        if (dish && hasCommentAndIsOwner(req, dish, cId)) {
          // only by owner
          dish.comments.id(cId).remove();
          dish.save()
            .then((dish) => {
              Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                  resp.statusCode = 200;
                  resp.json(dish);
                })
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else if (!dish) {
          return next(errorDishNotFound(req.params.dishId));
        }
        else if (hasCommentAndIsNotOwner(req, dish, cId)) {
          return next(errorNotCommentOwner());
        }
        else {
          return next(errorCommentNotFound(cId));
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  });


module.exports = dishRouter;
