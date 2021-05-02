const HttpException = require('../utils/HttpException.utils');
const ItemModel = require('../models/item.model');
const { validationResult } = require('express-validator');
const uuid = require('uuid');
const path = require('path');
const multer = require('multer');

class ItemsController {
  async createItem(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new HttpException(422, { message: 'Validation failed!', errors }));
      return;
    }
    const { title, price } = req.body;
    let timestamp = Date.now();
    const created_at = Math.floor(timestamp / 1000);
    const result = await ItemModel.create(
      title,
      price,
      req.currentUser.id,
      created_at
    );
    if (!result) {
      next(HttpException(422, 'Something wrong'));
      return;
    }
    return res.json({
      id: result.insertId,
      created_at: created_at,
      title: title,
      price: price,
      image: 'http://localhost:5000/' + 'some.jpg',
      user_id: req.currentUser.id,
      user: {
        id: req.currentUser.id,
        name: req.currentUser.name,
        email: req.currentUser.email,
      },
    });
  }

  async getItems(req, res, next) {
    let itemsList = await ItemModel.find();
    if (!itemsList.length) {
      next(HttpException(404, 'Items not found'));
      return;
    }

    itemsList = itemsList.map((item) => {
      item.img == null
        ? (item.img = 'http://localhost:5000/some.jpg')
        : (item.img = 'http://localhost:5000/' + item.img);
      const { password, ...rest } = item;
      return rest;
    });
    res.json(itemsList);
  }
  async getItemById(req, res, next) {
    const item = await ItemModel.findOne({ item_id: req.params.id });
    if (!item) {
      next(new HttpException(404, 'Item not found'));
      return;
    }
    let { img } = item;
    if (img == null) img = 'some.jpg';
    res.json({
      id: item.item_id,
      created_at: item.created_at,
      title: item.title,
      price: item.price,
      image: 'http://localhost:5000/' + img,
      user_id: item.user_id,
      user: {
        id: item.id,
        name: item.name,
        email: item.email,
      },
    });
  }

  async updateItemById(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new HttpException(422, { message: 'Validation failed!', errors }));
      return;
    }
    const { title, price } = req.body;

    const item = await ItemModel.findOne({ item_id: req.params.id });
    if (!item) {
      next(new HttpException(404, 'item not found'));
      return;
    }
    ////check on ownerAuthorized

    if (req.currentUser.id != item.user_id) {
      next(new HttpException(403, 'You have no access to do this'));
      return;
    }
    const result = await ItemModel.update(req.body, req.params.id);
    if (!result) {
      next(new HttpException(404, 'Item not found'));
      return;
    }
    const { affectedRows, changedRows } = result;
    const message = !affectedRows
      ? 'Item not found'
      : affectedRows && changedRows
      ? 'Item updated successfully'
      : 'Updated failed';
    if (message == 'Updated failed') {
      next(
        new HttpException(
          422,
          'Change something, thise title and price already exist'
        )
      );
      return;
    }
    return res.json({
      message,
      id: item.item_id,
      created_at: item.created_at,
      title: title,
      price: price,
      image: 'http://localhost:5000/' + item.img,
      user_id: item.user_id,
      user: {
        id: item.id,
        name: item.name,
        email: item.email,
      },
    });
  }

  async deleteItemById(req, res, next) {
    const item = await ItemModel.findOne({ item_id: req.params.id });
    if (!item) {
      next(new HttpException(404, 'item not found'));
      return;
    }
    ////check on ownerAuthorized

    if (req.currentUser.id != item.user_id) {
      next(new HttpException(403, 'You have no access to do this'));
      return;
    }
    const result = await ItemModel.delete(req.params.id);
    if (!result) {
      next(new HttpException(404, 'Item not found'));
      return;
    }
    return res.json('Item has been deleted');
  }

  async addItemImgbyId(req, res, next) {
    const itemId = req.params.id;
    const { img } = req.files;
    let fileName = uuid.v4() + '.jpg';
    img.mv(path.resolve(__dirname, '..', 'static', fileName));

    const item = await ItemModel.findOne({ item_id: itemId });
    if (!item) {
      next(new HttpException(404, 'item not found'));
      return;
    }
    ////check on ownerAuthorized
    if (req.currentUser.id != item.user_id) {
      next(new HttpException(403, 'You have no access to do this'));
      return;
    }

    const addImage = await ItemModel.addImg(itemId, fileName);
    if (!addImage) {
      next(new HttpException(404, 'Item not found'));
      return;
    }

    return res.json({
      id: itemId,
      created_at: item.created_at,
      title: item.title,
      price: item.price,
      image: 'http://localhost:5000/' + fileName,
      user_id: item.user_id,
      user: {
        id: item.id,
        name: item.name,
        email: item.email,
      },
    });
  }
}

module.exports = new ItemsController();
