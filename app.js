const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const errorMiddleware = require("./middleware/errors");
const catchAsyncErrors = require("./middleware/catchAsyncErrors");

//Setting up config.env file variables
dotenv.config({ path: "./config/.env" });

//Connecting to database
connectDatabase();

//Setup body parser
app.use(express.json());

//Importing all routes
const songs = require("./routes/songs");
const users = require("./routes/users");
app.use("/api/v1", users);
app.use("/api/v1", songs);

//Middleware to handle errors
app.use(errorMiddleware);

//Middleware to handle async errors
app.use(catchAsyncErrors);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});
