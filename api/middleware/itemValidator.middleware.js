const { body } = require('express-validator');

exports.createItemSchema = [
  body('title')
    .exists()
    .withMessage('title is required')
    .isLength({ min: 3 })
    .withMessage('Must be at least 3 chars long'),
  body('price')
    .exists()
    .withMessage('price is required')
    .isNumeric()
    .withMessage('Must be a number'),
];

exports.updateItemSchema = [
  body('title')
    .exists()
    .withMessage('title is required')
    .isLength({ min: 3 })
    .withMessage('Must be at least 3 chars long'),
  body('price')
    .exists()
    .withMessage('price is required')
    .isNumeric()
    .withMessage('Must be a number'),
];
