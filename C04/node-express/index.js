const express = require('express'),
      http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');


const hostname = 'localhost';
const port = 3000;

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

// executed by default
app.all('/dishes', (req, resp, next) => {
  resp.statusCode = 200;
  resp.setHeader('Content-Type', 'text/plain');
  next();  // keep going to next entry point
});


// dishes endpoints
app.get('/dishes', (req, resp, _next) => {
  resp.end('Will send the dishes to you!');
});

app.post('/dishes', (req, resp, _next) => {
  resp.end(`Will add the dish: ${req.body.name} with details: ${req.body.description}`);
});

app.put('/dishes', (req, resp, _next) => {
  resp.statusCode = 403;
  resp.end('PUT operation not supported on /dishes yet...');
});

app.patch('/dishes', (req, resp, _next) => {
  resp.statusCode = 403;
  resp.end('PATCH operation not supported on /dishes yet...');
});

app.delete('/dishes', (req, resp, _next) => {
  resp.end('Deleting all dishes');
});

// dish details endpoints
app.get('/dishes/:dishId', (req, resp, _next) => {
  resp.end(`Will send details of the dish: ${req.params.dishId} to you!`);
});

app.post('/dishes/:dishId', (req, resp, _next) => {
  resp.statusCode = 403;
  resp.end(`POST operation not supported on /dishes/${req.params.dishId}`);
});

app.put('/dishes/:dishId', (req, resp, _next) => {
  resp.write(`Updating the dish: ${req.params.dishId}\n`);
  resp.end(`Will update the dish: ${req.body.name} with details: ${req.body.description}`);
});

app.delete('/dishes/:dishId', (req, resp, _next) => {
  resp.end(`Deleting dish: ${req.params.dishId}`);
});

// rest
app.use(express.static(__dirname + '/public'));

app.use((req, resp, next) => {
  resp.statusCode = 200;
  resp.setHeader('Content-Type', 'text/html');
  resp.end('<html><body><h1>This is an Express Server</h1></body></html>');
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
