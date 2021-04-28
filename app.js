const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const HttpException = require('./api/utils/HttpException.utils');
require('dotenv').config();
const errorHandler = require('./api/middleware/ErrorHandlingMiddleware');
const itemsRoutes = require('./api/routes/items');
const userRoutes = require('./api/routes/user');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(fileUpload({}));
app.use(cors());

app.use('/api', itemsRoutes);
app.use('/api', userRoutes);

app.all('*', (req, res, next) => {
  const err = new HttpException(404, 'Endpoint Not Found');
  next(err);
});
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
