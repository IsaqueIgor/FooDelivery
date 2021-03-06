const express = require('express');
const { body } = require('express-validator');

const itemController = require('../controllers/ItemController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
  '/create-item',
  auth.verifyRestaurant,
  [
    body('title', 'Title needs to be at least 4 characters long')
      .trim()
      .isLength({ min: 4 }),
    body('description', 'Description cannot be empty').trim().not().isEmpty(),
    body('price', 'Price cannot be empty').trim().not().isEmpty(),
  ],
  itemController.createItem
);

router.delete(
  '/delete-item/:itemId',
  auth.verifyRestaurant,
  itemController.deleteItem
);

router.put(
  '/edit-item/:itemId',
  auth.verifyRestaurant,
  [
    body('title', 'Title needs to be at least 4 characters long')
      .trim()
      .isLength({ min: 4 }),
    body('description', 'Description cannot be empty').trim().not().isEmpty(),
    body('price', 'Price cannot be empty').trim().not().isEmpty(),
  ],
  itemController.editItem
);

router.get('/get-items', auth.verifyRestaurant, itemController.getItems);

router.get('/get-item/:itemId', auth.verifyRestaurant, itemController.getItem);

module.exports = router;
