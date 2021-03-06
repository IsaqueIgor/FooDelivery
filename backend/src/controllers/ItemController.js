const path = require('path');
const fs = require('fs');

const { validationResult } = require('express-validator');

const Item = require('../models/Item');
const Restaurant = require('../models/Restaurant');
const Account = require('../models/Account');

exports.createItem = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed, Incorrect data entered.');
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  if (!req.file) {
    const error = new Error('Upload an image as well.');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;
  const title = req.body.title;
  const price = req.body.price;
  const tags = req.body.tags;
  const description = req.body.description;
  let creator;

  Account.findById(req.loggedInUserId)
    .then((account) => {
      return Restaurant.findOne({ account: account._id });
    })
    .then((restaurant) => {
      creator = restaurant;

      const item = new Item({
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
        tags: tags,
        creator: creator._id,
      });

      item
        .save()
        .then((savedItem) => {
          restaurant.items.push(item);
          return restaurant.save();
        })
        .then((updatedrestaurant) => {
          res.status(201).json({
            message: 'Item created!',
            item: item,
            creator: { _id: creator._id, name: creator.name },
          });
        });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.deleteItem = (req, res, next) => {
  const itemId = req.params.itemId;
  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        const error = new Error(
          'Could not find any Item with the given itemId'
        );
        error.statusCode = 404;
        throw error;
      }

      clearImage(item.imageUrl);

      return Item.findByIdAndRemove(itemId);
    })
    .then((deletedItem) => {
      return Account.findById(req.loggedInUserId);
    })
    .then((account) => {
      return restaurant.findOne({ account: account._id });
    })
    .then((restaurant) => {
      restaurant.items.pull(itemId);
      return restaurant.save();
    })
    .then((result) => {
      res.status(200).json({
        message: 'Item deleted successfully.',
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.editItem = (req, res, next) => {
  const itemId = req.params.itemId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed, Incorrect data entered.');
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  let imageUrl = req.body.image;
  const title = req.body.title;
  const price = req.body.price;
  const tags = req.body.tags;
  const description = req.body.description;

  if (req.file) imageUrl = req.file.path;
  if (!imageUrl) {
    const error = new Error('Image was not found, try again.');
    error.statusCode = 404;
    throw error;
  }

  Item.findById(itemId)
    .then((fetchedItem) => {
      if (!fetchedItem) {
        const error = new Error(
          'Could not find any Item with the given itemId'
        );
        error.statusCode = 404;
        throw error;
      }

      if (imageUrl !== fetchedItem.imageUrl) {
        clearImage(fetchedItem.imageUrl);
      }

      fetchedItem.title = title;
      fetchedItem.description = description;
      fetchedItem.price = price;
      fetchedItem.tags = tags;
      fetchedItem.imageUrl = imageUrl;

      return fetchedItem.save();
    })
    .then((updatedItem) => {
      res.status(200).json({
        message: 'Item updated',
        item: updatedItem,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.getItems = (req, res, next) => {
  Account.findById(req.loggedInUserId)
    .then((account) => {
      return Restaurant.findOne({ account: account._id });
    })
    .then((restaurant) => {
      return Item.find({ _id: { $in: restaurant.items } });
    })
    .then((items) => {
      res.json({ items: items });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.getItem = (req, res, next) => {
  const itemId = req.params.itemId;
  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        const error = new Error(
          'Could not find any Item with the given itemId'
        );
        error.statusCode = 404;
        throw error;
      }
      res
        .status(200)
        .json({ message: 'Item fetched successfully', item: item });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

const clearImage = (filepath) => {
  filepath = path.join(__dirname, '../', filepath);
  fs.unlink(filepath, (err) => {
    console.log(err);
  });
};
