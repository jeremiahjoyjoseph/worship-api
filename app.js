const express = require("express");
const app = express();

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const connectDatabase = require("./config/database");
const errorMiddleware = require("./middleware/errors");
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

// Handle file uploads
app.use(fileUpload());

//Use rate limit NOT WORKING
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 24 hrs in milliseconds
  limit: 100,
  message: "You have exceeded the 100 requests in 10 mins! Who are you?",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

//Setup security headers
app.use(helmet());

//Importing all routes
const songs = require("./routes/songs");
const auth = require("./routes/auth");
const user = require("./routes/user");

app.use("/api/v1", auth);
app.use("/api/v1", songs);
app.use("/api/v1", user);

//Handling error in urls/routes
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found.`, NOT_FOUND));
});

//Middleware to handle errors
app.use(errorMiddleware);

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
