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

module.exports = dishRouter;
