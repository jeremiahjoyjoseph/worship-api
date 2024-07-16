const mongoose = require("mongoose");
const { locations } = require("../config/locations");
const { bandRoles } = require("../config/bandRoles");
const { LocationSchema } = require("./location");
const validator = require("validator");

const worshipTeamSchema = mongoose.Schema({
  id: String,
  name: String,
  wtPrimaryRole: {
    type: String,
    trim: true,
    enum: {
      values: bandRoles,
      message: "Please select valid worship team role.",
    },
  },
  wtSecondaryRole: {
    type: String,
    trim: true,
    enum: {
      values: bandRoles,
      message: "Please select valid worship team role.",
    },
  },
  isMd: {
    type: Boolean,
    default: false,
  },
});

const locationRosterSchema = mongoose.Schema({
  location: {
    type: String,
    trim: true,
    enum: {
      values: locations,
      message: "Please select valid location",
    },
  },
  worshipTeam: { worshipTeamSchema },
});

const rosterDateSchema = new mongoose.Schema({
  eventDate: {
    type: String,
    required: true,
  },
  eventEndDate: {
    type: String,
    required: true,
  },
  eventName: {
    type: String,
    trim: true,
    required: true,
  },
  minAge: {
    type: Number,
  },
  maxAge: {
    type: Number,
  },
  isSunday: {
    type: Boolean,
    default: false,
    required: true,
  },
  sermonTopic: {
    type: String,
    required: [
      function () {
        return this.isSunday === true;
      },
      "Please Provide Sermon Topic",
    ],
  },
  sermonNote: {
    type: String,
  },
  location: [LocationSchema],
});

const submissionsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userData: { type: Object },
  hasSubmittedDates: { type: Boolean, default: false },
  submittedDates: [rosterDateSchema],
});

const RosterSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: [
        true,
        "Please enter the month and year of the roster in the format MM/YYYY",
      ],
      unique: true,
    },
    requiredDates: [rosterDateSchema],
    submissions: [submissionsSchema],
    roster: [locationRosterSchema],
    rosterUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return validator.isURL(v, {
            protocols: ["http", "https"],
            require_protocol: true,
            require_tld: false, // This allows URLs without a top-level domain, like localhost
            allow_underscores: true,
          });
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roster", RosterSchema);
