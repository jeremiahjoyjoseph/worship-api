const express = require("express");

const app = express();

const dotenv = require("dotenv");

//Setting up config.env file variables
dotenv.config({ path: "./config/.env" });

//Importing all routes
const songs = require("./routes/songs");

//Songs
app.use("/api/v1", songs);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});
