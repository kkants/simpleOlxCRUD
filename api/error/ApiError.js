class ApiError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static NotFound(message) {
    return new ApiError(404, message);
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static Forbidden(message) {
    return new ApiError(403, message);
  }

  static Unauthorized(message) {
    return new ApiError(401, message);
  }

  static UnprocessableEntity(message) {
    return new ApiError(422, message);
  }

  static Internal(message) {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
