const mongoose = require("mongoose");
const { locations } = require("../util/locations");
const { bandRoles } = require("../util/bandRoles");
const { events } = require("../util/events");
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

const requiredDatesSchema = new mongoose.Schema({
  eventName: {
    type: String,
    trim: true,
    enum: {
      values: events,
      message: "Event name is not available",
    },
  },
  sermonTopic: {
    type: String,
  },
  eventDate: {
    type: Date,
    required: true,
  },
});

const datesGivenSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  hasGivenDates: { type: Boolean, default: false },
  givenDates: [requiredDatesSchema],
});

const RosterSchema = new mongoose.Schema(
  {
    month: {
      type: Date,
      required: [
        true,
        "Please enter the month and year of the roster in the format MM/YYYY",
      ],
      unique: true,
    },
    requiredDates: [requiredDates],
    datesGiven: [datesGivenSchema],
    roster: [locationRosterSchema],
    giveDatesUsingUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roster", RosterSchema);
