const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = [
  'http://localhost:3000',
  'https://localhost:3443',
  'https://turing.corto-nz.home:3443',
  'http://turing.corto-nz.home:3001',  // React FrontEnd
  'http://localhost:3001'              // React FrontEnd
];

const corsOptionsDelegate = (req, cb) => {
  let corsOptions = { origin: false };
  console.log(`DEBUG: req.header('Origin'): [${req.header('Origin')}]`);

  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions.origin = true;
    return cb(null, corsOptions);
  }

  // https://www.coursera.org/learn/server-side-nodejs/discussions/weeks/4/threads/eM1vXyn7EemrCw4xitKDiA/replies/pjQvS6E_EemMaQrzhbOgcA
  cb(new Error("Not allowed by CORS"));
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
