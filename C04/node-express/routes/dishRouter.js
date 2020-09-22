const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
  .all((req, resp, next) => {
    resp.statusCode = 200;
    resp.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, resp, _next) => {
    resp.end('Will send all the dishes to you!');
  })
  .post((req, resp, _next) => {
    resp.end(`Will add the dish: ${req.body.name} with details: ${req.body.description}`);
  })
  .put((req, resp, _next) => {
    resp.statusCode = 403;
    resp.end('PUT operation not supported on /dishes yet...');
  })
  .patch((req, resp, _next) => {
    resp.statusCode = 403;
    resp.end('PATCH operation not supported on /dishes yet...');
  })
  .delete((req, resp, _next) => {
    resp.end('Deleting all dishes');
  });

dishRouter.route('/:dishId')
  .all((req, resp, next) => {
    resp.statusCode = 200;
    resp.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, resp, _next) => {
    resp.end(`Will send details of the dish: ${req.params.dishId} to you!`);
  })
  .post((req, resp, _next) => {
    resp.statusCode = 403;
    resp.end(`POST operation not supported on /dishes/${req.params.dishId}`);
  })
  .put((req, resp, _next) => {
    resp.write(`Updating the dish: ${req.params.dishId}\n`);
    resp.end(`Will update the dish: ${req.body.name} with details: ${req.body.description}`);
  })
  .delete((req, resp, _next) => {
    resp.end(`Deleting dish: ${req.params.dishId}`);
  });

module.exports = dishRouter;
