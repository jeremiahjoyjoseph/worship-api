const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDatabase = require("./config/database");
const errorMiddleware = require("./middleware/errors");
const catchAsyncErrors = require("./middleware/catchAsyncErrors");
const ErrorHandler = require("./util/errorHandler");
const { NOT_FOUND } = require("./util/httpStatusCodes");

//Setting up config.env file variables
dotenv.config({ path: "./config/.env" });

// Handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to uncaught exception.");
  process.exit(1);
});

//Connecting to database
connectDatabase();

//Setup body parser
app.use(express.json());

//Set cookie parser
app.use(cookieParser());

//Importing all routes
const songs = require("./routes/songs");
const auth = require("./routes/auth");
app.use("/api/v1", auth);
app.use("/api/v1", songs);

//Handling error in urls/routes
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found.`, NOT_FOUND));
});

//Middleware to handle errors
app.use(errorMiddleware);

//Middleware to handle async errors
app.use(catchAsyncErrors);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(
    `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});

//Handling unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to unhandled promise rejection.");
  server.close(() => {
    process.exit(1);
  });
});
