const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/UserController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/restaurants', userController.getRestaurants);

router.get('/restaurant/:restId', userController.getRestaurant);

router.post('/cart', auth.verifyUser, userController.postCart);

router.get('/cart', auth.verifyUser, userController.getCart);

router.post(
  '/delete-cart-item',
  auth.verifyUser,
  userController.postCartDelete
);

router.post(
  '/remove-cart-item/:itemId',
  auth.verifyUser,
  userController.postCartRemove
);

router.post(
  '/user/address',
  auth.verifyUser,
  [
    body('phone', 'Enter a valid 10 digit phone number')
      .trim()
      .isLength({ min: 10, max: 10 }),
    body('street', 'Street cannot be empty').trim().not().isEmpty(),
    body('locality', 'Locality cannot be empty').trim().not().isEmpty(),
    body('apt', 'Apartment name cannot be empty').trim().not().isEmpty(),
    body('cep', 'Zipcode cannot be empty').trim().not().isEmpty(),
  ],
  userController.postAddress
);

router.get('/user', userController.getLoggedInUser);

router.post('/order', auth.verifyUser, userController.postOrder);

router.get('/orders', userController.getOrders);

router.get('/clients/connected', userController.getConnectedClients);

router.get(
  '/restaurants-location/:latitude/:longitude',
  userController.getRestaurantsByAddress
);

module.exports = router;
