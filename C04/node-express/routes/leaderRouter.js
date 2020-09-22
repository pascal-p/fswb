const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
  .all((req, resp, next) => {
    resp.statusCode = 200;
    resp.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, resp, _next) => {
    resp.end('Will send all the leaders to you!');
  })
  .post((req, resp, _next) => {
    resp.end(`Will add the leader: ${req.body.name} with details: ${req.body.description}`);
  })
  .put((req, resp, _next) => {
    resp.statusCode = 403;
    resp.end('PUT operation not supported on /leaders yet...');
  })
  .delete((req, resp, _next) => {
    resp.end('Deleting all leaders');
  });

leaderRouter.route('/:leaderId')
  .all((req, resp, next) => {
    resp.statusCode = 200;
    resp.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, resp, _next) => {
    resp.end(`Will send details of the leader: ${req.params.leaderId} to you!`);
  })
  .post((req, resp, _next) => {
    resp.statusCode = 403;
    resp.end(`POST operation not supported on /leaders/${req.params.leaderId}`);
  })
  .put((req, resp, _next) => {
    resp.write(`Updating the leader: ${req.params.leaderId}\n`);
    resp.end(`Will update the leader: ${req.body.name} with details: ${req.body.description}`);
  })
  .delete((req, resp, _next) => {
    resp.end(`Deleting leader: ${req.params.leaderId}`);
  });

module.exports = leaderRouter;
