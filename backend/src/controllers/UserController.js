const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

const Restaurant = require('../models/Restaurant');
const Item = require('../models/Item');
const User = require('../models/User');
const Account = require('../models/Account');
const Order = require('../models/Order');

const app = require('../../app');

exports.getRestaurants = (req, res, next) => {
  Restaurant.find()
    .populate('account', 'isVerified')
    .sort({ createdAt: -1 })
    .then((restaurants) => {
      const restaurantsFinal = restaurants.filter((restaurant) => {
        return restaurant.account.isVerified === true;
      });
      res.status(200).json({
        restaurants: restaurantsFinal,
        totalItems: restaurantsFinal.length,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};
