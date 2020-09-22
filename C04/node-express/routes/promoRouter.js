const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
  .all((req, resp, next) => {
    resp.statusCode = 200;
    resp.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, resp, _next) => {
    resp.end('Will send all the promotions to you!');
  })
  .post((req, resp, _next) => {
    resp.end(`Will add the promotion: ${req.body.name} with details: ${req.body.description}`);
  })
  .put((req, resp, _next) => {
    // not sure if we support this operation or not...
    resp.statusCode = 403;
    resp.end('PUT operation not supported on /promotions yet...');
  })
  .delete((req, resp, _next) => {
    resp.end('Deleting all promotions');
  });

promoRouter.route('/:promoId')
  .all((req, resp, next) => {
    resp.statusCode = 200;
    resp.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, resp, _next) => {
    resp.end(`Will send details of the promotion: ${req.params.promoId} to you!`);
  })
  .post((req, resp, _next) => {
    resp.statusCode = 403;
    resp.end(`POST operation not supported on /promotions/${req.params.promoId}`);
  })
  .put((req, resp, _next) => {
    resp.write(`Updating the promotion: ${req.params.promoId}\n`);
    resp.end(`Will update the promotion: ${req.body.name} with details: ${req.body.description}`);
  })
  .delete((req, resp, _next) => {
    resp.end(`Deleting promotion: ${req.params.promoId}`);
  });

module.exports = promoRouter;
