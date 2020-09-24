const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

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
  .all((_req, resp, next) => {
    resp.statusCode = 403;
    next();
  })
  .get(authenticate.verifyUser,
       authenticate.verifyAdmin, (req, resp, _next) => {
         // resp.statusCode = 403;
         resp.end('GET operation not supported on /imageUpload');
       })
  .post(authenticate.verifyUser,
        authenticate.verifyAdmin,
        upload.single('imageFile'), (req, resp) => {
          resp.statusCode = 200;
          resp.setHeader('Content-Type', 'application/json');
          resp.json(req.file);
        })
  .put(authenticate.verifyUser,
       authenticate.verifyAdmin, (req, resp, _next) => {
         // resp.statusCode = 403;
         resp.end('PUT operation not supported on /imageUpload');
       })
  .delete(authenticate.verifyUser,
          authenticate.verifyAdmin, (req, resp, _next) => {
            //resp.statusCode = 403;
            resp.end('DELETE operation not supported on /imageUpload');
          });

module.exports = uploadRouter;
