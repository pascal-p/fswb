const express = require('express'),
      http = require('http');

const hostname = 'localhost';
const port = 3000;

const app = express();

app.use((req, resp, next) => {
  console.log(req.headers);
  
  resp.statusCode = 200;
  resp.setHeader('Content-Type', 'text/html');
  resp.end('<html><body><h1>This is an Express Server</h1></body></html>');
  
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
