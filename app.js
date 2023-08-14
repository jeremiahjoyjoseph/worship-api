const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//Setting up config.env file variables
dotenv.config({ path: "./config/.env" });

//Creating our own middleware
const middleware = (req, res, next) => {
  console.log("Hello from middleware");

  //setting up user variable globally
  req.user = "Jeremiah Joy Joseph";
  next();
};
app.use(middleware);

//Connecting to database
connectDatabase();

//Setup body parser
app.use(express.json());

//Importing all routes
const songs = require("./routes/songs");
const users = require("./routes/users");
app.use("/api/v1", users);
app.use("/api/v1", songs);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});
