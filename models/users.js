const moment = require("moment");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      lowercase: true,
      required: [true, "Please enter first name."],
      trim: true,
    },
    middleName: {
      type: String,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Please enter last name."],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please enter email."],
    },
    phNo: {
      type: String,
      trim: true,
      required: [true, "Please enter phone number."],
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Please provide unique username."],
    },
    role: {
      type: String,
      trim: true,
      required: [true, "Please provide role of user."],
      enum: {
        values: [
          "Admin",
          "Worship Leader",
          "Worship Team",
          "Media Team",
          "Sound Team",
        ],
        message: "Please enter valid role",
      },
      lastLogInDate: {
        type: Date,
        select: false,
      },
    },
    slug: String,
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

module.exports = mongoose.model("Users", UserSchema);
