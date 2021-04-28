const express = require('express');
const router = express.Router();

const multer = require('multer');

// const checkAuth = require('../middleware/check-auth');

const itemController = require('../controllers/items.controller');

// const storage = multer.diskStorage({
//   destination: function (req, file, next) {
//     next(null, './uploads/');
//   },
//   filename: function (req, file, next) {
//     next(null, file.originalname);
//   },
// });

// const fileFilter = (req, file, next) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     next(null, true);
//   } else {
//     next(null, false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
//   fileFilter: fileFilter,
// });

router.post('/items', itemController.createItem);
router.post('/items/:id/images', itemController.addItemImgbyId);

router.get('/items', itemController.getItems);
router.get('/items/:id', itemController.getItemById);
router.put('/items/:id', itemController.updateItemById);
router.delete('/items/:id', itemController.deleteItemById);

module.exports = router;
