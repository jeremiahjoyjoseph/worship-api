const { INTERNAL_SERVER_ERROR } = require("../util/httpStatusCodes");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || INTERNAL_SERVER_ERROR;
  err.message = err.message || "Internal Server Error";

  res.status = err.statusCode.json({
    success: false,
    message: err.message,
  });
};
