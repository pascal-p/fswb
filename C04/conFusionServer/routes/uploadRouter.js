const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const authenticate = require('../authenticate');
const cors = require('./cors');
const ctype = 'application/json'

// helpers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

const imageFileFilter = (req, file, cb) => {
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('You can upload only image files!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage,
                        fileFilter: imageFileFilter });


// Router
const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .all((_req, resp, next) => {
    resp.statusCode = 403;
    next();
  })
  .get(cors.cors,
       authenticate.verifyUser,
       authenticate.verifyAdmin, (req, resp, _next) => {
         resp.end('GET operation not supported on /imageUpload');
       })
  .post(cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        upload.single('imageFile'), (req, resp) => {
          resp.statusCode = 200;
          resp.setHeader('Content-Type', 'application/json');
          resp.json(req.file);
        })
  .put(cors.corsWithOptions,
       authenticate.verifyUser,
       authenticate.verifyAdmin, (req, resp, _next) => {
         resp.end('PUT operation not supported on /imageUpload');
       })
  .delete(cors.corsWithOptions,
          authenticate.verifyUser,
          authenticate.verifyAdmin, (req, resp, _next) => {
            resp.end('DELETE operation not supported on /imageUpload');
          });

module.exports = uploadRouter;
