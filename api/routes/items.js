const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const awaitHandler = require('../middleware/awaitHandler.middleware');
const { createItemSchema, updateItemSchema } = require('../middleware/itemValidator.middleware');

const itemController = require('../controllers/items.controller');

router.post('/items', auth(), createItemSchema, awaitHandler(itemController.createItem));
router.get('/items', awaitHandler(itemController.getItems));

router.get('/items/:id', awaitHandler(itemController.getItemById));
router.put('/items/:id', auth(), updateItemSchema, awaitHandler(itemController.updateItemById));
router.delete('/items/:id', auth(), awaitHandler(itemController.deleteItemById));

router.post('/items/:id/images', auth(), awaitHandler(itemController.addItemImgbyId));

module.exports = router;
