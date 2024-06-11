const mongoose = require("mongoose");
const { locations } = require("../config/locations");
const { bandRoles } = require("../config/bandRoles");
const { events } = require("../config/events");
const Schema = mongoose.Schema;

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
  locationName: {
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
  eventName: {
    type: String,
    trim: true,
    enum: {
      values: events,
      message: "Event name is not available",
    },
    default: "other",
    required: true,
  },
  sermonTopic: {
    type: String,
  },
  eventDate: {
    type: String,
    required: true,
  },
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
    giveDatesUsingUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roster", RosterSchema);
