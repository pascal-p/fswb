const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, resp) => {
  console.log('Request for ' + req.url + ' by method ' + req.method);

  if (req.method === 'GET') {
    let fileUrl;

    if (req.url === '/') fileUrl = '/index.html';
    else fileUrl = req.url;

    let filePath = path.resolve('./public' + fileUrl);
    const fileExt = path.extname(filePath);

    if (fileExt === '.html') {
      fs.exists(filePath, (exists) => {
        if (!exists) {
          resp.statusCode = 404;
          resp.setHeader('Content-Type', 'text/html');
          resp.end('<html><body><h1>Error 404: ' + fileUrl +
                   ' not found</h1></body></html>');
          return;
        }

        resp.statusCode = 200;
        resp.setHeader('Content-Type', 'text/html');
        fs.createReadStream(filePath).pipe(resp);
      });
    }
    else {
      resp.statusCode = 404;
      resp.setHeader('Content-Type', 'text/html');
      resp.end('<html><body><h1>Error 404: ' + fileUrl +
               ' not a HTML file</h1></body></html>');
    }
  }
  else {
    resp.statusCode = 404;
    resp.setHeader('Content-Type', 'text/html');
    resp.end('<html><body><h1>Error 404: ' + req.method +
              ' not supported</h1></body></html>');
  }
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
