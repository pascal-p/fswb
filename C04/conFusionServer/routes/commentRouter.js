const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const Comments = require('../models/comments');
const cors = require('./cors');
const commentRouter = express.Router();
const ctype = 'application/json'

commentRouter.use(bodyParser.json());


//
// Helper functions
const errorCommentNotFound = (cId=undefined) => {
  let err = new Error(cid === undefined ? 'Comment not found' : 'Comment ' + cId + ' not found');
  err.status = 404;
  return err;
}

const renderObj = (resp, _next, obj, code=200) => {
  resp.statusCode = code;
  resp.json(obj);
}

const populateAndRenderObj = (resp, next, obj, code=200) => {
  Comment.findById(obj._id)
    .populate('author')
    .then((comment) => {
      renderObj(resp, next, comment, code);
    })
}

//
// Single Comment
commentRouter.route('/')
  .options(cors.corsWithOptions, (req, resp) => { resp.sendStatus(200); })
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get(cors.cors, (req, resp, next) => {
    Comments.find(req.query)
      .populate('author')
      .then((comments) => {
        renderObj(resp, next, comments);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,
        authenticate.verifyUser, (req, resp, next) => {
    if (req.body) {
      req.body.author = req.user._id;
      Comments.create(req.body)
        .then((comment) => {
          populateAndRenderObj(resp, next, comment, 201);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
      errorCommentNotFound();
    }
  })
  .put(cors.corsWithOptions,
       authenticate.verifyUser, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end('PUT operation not supported on /comments/');
  })
  .delete(cors.corsWithOptions,
          authenticate.verifyUser,
          authenticate.verifyAdmin, (req, resp, next) => {
    Comments.remove({})
      .then((out) => {
        renderObj(resp, next, out);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

// Single comment by commentId
commentRouter.route('/:commentId')
  .options(cors.corsWithOptions, (req, resp) => { resp.sendStatus(200); })
  .all((req, resp, next) => {
    resp.setHeader('Content-Type', ctype);
    next();
  })
  .get(cors.cors, (req, resp, next) => {
    Comments.findById(req.params.commentId)
      .populate('author')
      .then((comment) => {
        if (comment && comment.id(req.params.commentId) != null) {   // ???? TO TEST!
          renderObj(resp, next, comment.id(req.params.commentId));
        }
        else {
          errorCommentNotFound(req.params.commentId);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,
        authenticate.verifyUser, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end('POST operation not supported on /comments/' + req.params.commentId);
  })
  .put(cors.corsWithOptions,
       authenticate.verifyUser, (req, resp, next) => {
    const cId = req.params.commentId;
    Comments.findById(cId)
      .then((comment) => {
        if (comment) {
          if (!comment.author.equals(req.user._id)) {
            let err = new Error('You are not authorized to update this comment!');
            err.status = 403;
            return next(err);
          }

          req.body.author = req.user._id;
          Comments.findByIdAndUpdate(cId, {$set: req.body}, { new: true })
            .then((comment) => {
              populateAndRenderObj(resp, next, comment, 200);
            }, (err) => next(err));
        }
        else {
          errorCommentNotFound(req.params.commentId);
        }

      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions,
          authenticate.verifyUser, (req, resp, next) => {
    Comments.findById(req.params.dishId)
      .then((comment) => {
        if (comment) {
          if (!comment.author.equals(req.user._id)) {
            let err = new Error('You are not authorized to delete this comment!');
            err.status = 403;
            return next(err);
          }

          Comments.findByIdAndRemove(req.params.commentId)
            .then((resp) => {
              renderObj(resp, next, out);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
          errorCommentNotFound(req.params.commentId);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = commentRouter;
