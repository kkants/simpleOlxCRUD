function onError(error, req, res, next) {
  let { status = 500, message, data } = error;

  console.log(`[Error] ${error}`);
  message = status === 500 || !message ? 'Something wrong' : message;

  error = {
    type: 'error',
    status,
    message,
    ...(data && data),
  };

  res.status(status).send(message);
}

module.exports = onError;
