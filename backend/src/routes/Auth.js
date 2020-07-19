const express = require('express');
const { body } = require('express-validator');

const User = require('../models/User');
const Account = require('../models/Account');
const authController = require('../controllers/AuthController');

const router = express.Router();

router.post(
  '/signup-user',
  [
    body('email', 'Please enter a valid email to continue.')
      .isEmail()
      .custom((value, { req }) => {
        return Account.findOne({ email: value }).then((accountDoc) => {
          if (accountDoc) {
            return Promise.reject(
              'Email address already exists, please try again with another email.'
            );
          }
        });
      })
      .normalizeEmail(),
    body('password', 'Password should be at least 6 characters long')
      .trim()
      .isLength({ min: 6 }),
    body('firstName', 'First Name cannot be empty').trim().not().isEmpty(),
    body('lastName', 'Last Name cannot be empty').trim().not().isEmpty(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      }),
  ],
  authController.signupUser
);

router.get('/verify/:token', authController.verifyAccount);

router.post('/login', authController.login);

router.post(
  '/signup-restaurant',
  [
    body('email', 'Please enter a valid email to continue.')
      .isEmail()
      .custom((value, { req }) => {
        return Account.findOne({ email: value }).then((accountDoc) => {
          if (accountDoc) {
            return Promise.reject(
              'Email address already exists, please try again with another business email.'
            );
          }
        });
      })
      .normalizeEmail(),
    body('password', 'Password should be at least 6 characters long')
      .trim()
      .isLength({ min: 6 }),
    body('name', 'Restaurant Name cannot be empty').trim().not().isEmpty(),
    body('payment', 'Payment cannot be empty').trim().not().isEmpty(),
    body('tags', 'Tags cannot be empty').trim().not().isEmpty(),
    body('street', 'Street cannot be empty').trim().not().isEmpty(),
    body('locality', 'Locality cannot be empty').trim().not().isEmpty(),
    body('apt', 'Apartment name cannot be empty').trim().not().isEmpty(),
    body('cep', 'Zipcode cannot be empty').trim().not().isEmpty(),
    body('costForOne', 'Cost for one cannot be empty').trim().not().isEmpty(),
    body('minOrderAmount', 'Minimum Order Amount cannot be empty')
      .trim()
      .not()
      .isEmpty(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      }),
    body('phone', 'Enter a valid 10 digit phone number')
      .trim()
      .isLength({ min: 10, max: 10 }),
  ],
  authController.signupSeller
);

router.post('/images-test', authController.imagesTest);

module.exports = router;
