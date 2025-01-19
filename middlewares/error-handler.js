const BadRequestError = require("../errors/badRequestError");
const ConflictError = require("../errors/conflictError");
const ForbiddenError = require("../errors/forbiddenError");
const NotFoundError = require("../errors/notFoundError");
const UnauthorizedError = require("../errors/unauthorizedError");

function errorHandler(err, req, res, next) {
  console.error(err);
  const { statusCode = 500 } = err;
  const message = err.message || "An error has occured on the server";
  res.status(statusCode).send(message);
}

function handleRepeatErrors(err, res, next) {
  if (err.code === 11000) {
    return next(new ConflictError(err.message));
  }
  if (err.name === "ValidationError" || err.name === "CastError") {
    return next(new BadRequestError(err.message));
  }
  if (err.name === "DocumentNotFoundError") {
    return next(new NotFoundError(err.message));
  }
  if (err.name === "ForbiddenError") {
    return next(new ForbiddenError(err.message));
  }
  next(err);
}

module.exports = { errorHandler, handleRepeatErrors };
