require('dotenv').config();
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const {
  lightstep,
  opentelemetry,
} = require('lightstep-opentelemetry-launcher-node');
const sdk = lightstep.configureOpenTelemetry({
  accessToken: process.env.LIGHTSTEP_TOKEN,
  serviceName: 'olx-service',
});
sdk.start().then(() => {
  const express = require('express');
  const cors = require('cors');
  const fileUpload = require('express-fileupload');
  const HttpException = require('./api/utils/HttpException.utils');
  const onError = require('./api/middleware/ErrorHandlingMiddleware');
  const itemsRoutes = require('./api/routes/items');
  const userRoutes = require('./api/routes/user');
  const path = require('path');

  const PORT = process.env.PORT || 3000;

  const app = express();
  Sentry.init({
    dsn: process.env.SENTRY,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({
        app,
      }),
    ],
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());

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

  app.use(Sentry.Handlers.errorHandler());
  app.use(onError);

  app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

  module.exports = app;
});
