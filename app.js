const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const HttpException = require('./api/utils/HttpException.utils');
require('dotenv').config();
const errorHandler = require('./api/middleware/ErrorHandlingMiddleware');
const itemsRoutes = require('./api/routes/items');
const userRoutes = require('./api/routes/user');
const path = require('path');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, './api', 'static')));
app.use(fileUpload({}));

app.options('*', cors());

app.use('/api', itemsRoutes);
app.use('/api', userRoutes);

app.all('*', (req, res, next) => {
  const err = new HttpException(404, 'Endpoint Not Found');
  console.log(err);
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

module.exports = app;
