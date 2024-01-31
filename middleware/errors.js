const {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  DUPLICATE_KEY,
} = require("../util/httpStatusCodes");
const ErrorHandler = require("../util/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || INTERNAL_SERVER_ERROR;

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    error.message = err.message;

    // Wrong Mongoose Object ID Error
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, NOT_FOUND);
    }

    // Handling Mongoose Validation Error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, NOT_FOUND);
    }

    // Handle mongoose duplicate key error
    if (err.code === DUPLICATE_KEY) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
      error = new ErrorHandler(message, NOT_FOUND);
    }

    // Handling Wrong JWT token error
    if (err.name === "JsonWebTokenError") {
      const message = "JSON Web token is invalid. Try Again!";
      error = new ErrorHandler(message, INTERNAL_SERVER_ERROR);
    }

    // Handling Expired JWT token error
    if (err.name === "TokenExpiredError") {
      const message = "JSON Web token is expired. Try Again!";
      error = new ErrorHandler(message, INTERNAL_SERVER_ERROR);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error.",
    });
  }
};
