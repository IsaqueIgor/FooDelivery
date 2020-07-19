const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const authRoutes = require('./src/routes/Auth');
const itemRoutes = require('./src/routes/Item');
const userRoutes = require('./src/routes/User');

const database = require('./src/database');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Math.floor(Math.random() * 90000) + 10000 + '-' + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg'
  )
    cb(null, true);
  else cb(null, false);
};

const clients = {};
const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

app.use('/auth', upload.array('images', 10), authRoutes);
app.use('/restaurant', upload.single('image'), itemRoutes);
app.use(userRoutes);

app.use(bodyParser.json());

app.listen(process.env.PORT || 3333, () => {
  console.log('⚡️ Server listening on http://localhost:3333');
});

//set headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//error middleware
app.use((error, req, res, next) => {
  console.log(error + '--------------------------');
  const statusCode = error.statusCode || 500;
  const message = error.message;
  let errorsPresent;
  if (error.errors) {
    errorsPresent = error.errors;
  }

  res.status(statusCode).json({
    message: message,
    errors: errorsPresent,
  });
});

exports.clients = clients;
