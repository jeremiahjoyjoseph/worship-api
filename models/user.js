const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const slugify = require("slugify");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { roles, defaultRole } = require("../config/roles");
const { bandRoles } = require("../config/bandRoles");
const { locations } = require("../config/locations");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      lowercase: true,
      required: [true, "Please enter your name"],
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
    },
    nickname: {
      type: String,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: [
        true,
        "Please enter your email for all the serious communication",
      ],
      validate: [
        validator.isEmail,
        "Please provide an email address that is usable",
      ],
    },
    phone: {
      type: String,
      trim: true,
      minlength: 10,
      maxlength: 10,
      required: [
        true,
        "Please provide a phone number so we can get in touch with you super fast",
      ],
      validate: [validator.isMobilePhone, "Is this a valid phone number"],
    },
    username: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [
        8,
        "Your password must be at least 8 characters long, its for your own safety",
      ],
      select: false, //Hidden by default if false
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      trim: true,
      required: [true, "Please enter your role in the team"],
      enum: {
        values: roles,
        default: defaultRole,
        message: "Please select valid role.",
      },
    },
    lastLogInDate: {
      type: Date,
    },
    wtRolePrimary: {
      type: String,
      trim: true,
      required: [
        function () {
          return (
            this.role === "worship-team-member" ||
            this.role === "worship-leader" ||
            this.role === "worship-pastor"
          );
        },
        "Please enter primary role in worship team",
      ],
      enum: {
        values: bandRoles,
        message: "Please select valid worship team role.",
      },
    },
    wtRoleSecondary: {
      type: String,
      trim: true,
      enum: {
        values: [...bandRoles, ""],
        message: "Please select valid worship team role.",
      },
    },
    wtRoleSpare: {
      type: String,
      trim: true,
      enum: {
        values: [...bandRoles, ""],
        message: "Please select valid worship team role.",
      },
    },
    allBandRoles: {
      type: Boolean,
      default: false,
      select: false, //Hidden by default if false
    },
    gender: {
      type: String,
      trim: true,
      required: [true, "Please choose a gender"],
      enum: {
        values: ["male", "female"],
        message: "Please choose relevant gender.",
      },
    },
    dob: {
      type: String,
      trim: true,
    },
    md: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      trim: true,
      required: [true, "Please enter current status of team member"],
      enum: {
        values: ["active", "inactive"],
        message: "Please select available status",
      },
      default: "active",
    },
    locationPrimary: {
      type: String,
      trim: true,
      required: [
        function () {
          return (
            this.role === "worship-team-member" ||
            this.role === "worship-leader" ||
            this.role === "worship-pastor"
          );
        },
        "Please enter primary location",
      ],
      enum: {
        values: locations,
        message: "Please select valid location",
      },
    },
    locationSecondary: {
      type: String,
      trim: true,
      enum: {
        values: [...locations, ""],
        message: "Please select valid location",
      },
    },
    locationSpare: {
      type: String,
      trim: true,
      enum: {
        values: [...locations, ""],
        message: "Please select valid location",
      },
    },
    allLocations: {
      type: Boolean,
      default: false,
      select: true, //Hidden for normal responses.
    },
    slug: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

//Encrypting passwords before saving
UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
});

// Creating user slug before saving
UserSchema.pre("save", function (next) {
  //Creating slug before saving to DB
  this.slug = slugify(this.username, { lower: true });
  next();
});

//Return JSON web token
UserSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  });
};

//Compare user password with database password
UserSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
