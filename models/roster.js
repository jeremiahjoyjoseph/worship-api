const mongoose = require("mongoose");
const { LocationSchema } = require("./location");
const { BandRoleSchema } = require("./bandRole");
const validator = require("validator");

const worshipTeamSchema = mongoose.Schema({
  id: String,
  name: String,
  wtPrimaryRole: {
    BandRoleSchema,
  },
  wtSecondaryRole: {
    BandRoleSchema,
  },
  isMd: {
    type: Boolean,
    default: false,
  },
});

const locationRosterSchema = mongoose.Schema({
  location: {
    LocationSchema,
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
    name: {
      type: String,
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
