const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Account = require('../models/Account');
const Restaurant = require('../models/Restaurant');

exports.signupUser = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed, Incorrect data entered.');
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const email = req.body.email;
  const firstName = req.body.firstName;
  const password = req.body.password;
  const lastName = req.body.lastName;
  const role = req.body.role;
  let token;

  if (role !== 'ROLE_USER') {
    const error = new Error(
      'Signing up an user should have a role of ROLE_USER'
    );
    error.statusCode = 500;
    throw error;
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      token = crypto.randomBytes(32).toString('hex');

      const account = new Account({
        role: role,
        email: email,
        password: hashedPassword,
        accountVerifyToken: token,
        accountVerifyTokenExpiration: Date.now() + 3600000,
      });
      return account.save();
    })
    .then((savedAccount) => {
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        account: savedAccount,
      });
      return user.save();
    })
    .then((savedUser) => {
      transporter.sendMail({
        to: email,
        from: 'YOUR_SENDGRID_VERIFIED_EMAIL',
        subject: 'Verify your Account on FooDelivery',
        html: `
                      <p>Please verify your email by clicking on the link below - FooDelivery</p>
                      <p>Click this <a href="http://localhost:3333/auth/verify/${token}">link</a> to verify your account.</p>
                    `,
      });
      res.status(201).json({
        message:
          'User signed-up successfully, please verify your email before logging in.',
        userId: savedUser._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};
