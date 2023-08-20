const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const slugify = require("slugify");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
      validate: [validator.isEmail, "Please enter valid email address."],
    },
    phNo: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Please provide unique username."],
    },
    password: {
      type: String,
      required: [true, "Please enter password."],
      minlength: [8, "Your password must be at least 8 characters long."],
      select: false, //Hidden for normal responses.
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    role: {
      type: String,
      trim: true,
      required: [true, "Please provide role of user."],
      default: "guest",
      enum: {
        values: [
          "admin",
          "worship-leader",
          "worship-team",
          "media-team",
          "sound-team",
          "guest",
        ],
        message: "Please select valid role.",
      },
    },
    lastLogInDate: {
      type: Date,
      select: false,
    },
    slug: String,
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

//Encrypting passwords before saving
UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
});

//Creating song slug before saving
UserSchema.pre("save", function (next) {
  //Creating slug before saving to DB
  this.slug = slugify(this.username, { lower: true });
  next();
});

module.exports = mongoose.model("Users", UserSchema);
