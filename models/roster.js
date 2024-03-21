const mongoose = require("mongoose");
const User = require("../models/user");

const worshipTeam = mongoose.Schema({
  id: String,
  name: String,
  wtPrimaryRole: {
    type: String,
    trim: true,
    enum: {
      values: ["singing", "drums", "keys", "acoustic", "bass", "electric"],
      message: "Please select valid worship team role.",
    },
  },
  wtSecondaryRole: {
    type: String,
    trim: true,
    enum: {
      values: ["singing", "drums", "keys", "acoustic", "bass", "electric"],
      message: "Please select valid worship team role.",
    },
  },
  isMd: {
    type: Boolean,
    default: false,
  },
});

const plannedLocationRoster = mongoose.Schema({
  location: {
    type: String,
    trim: true,
    enum: {
      values: ["central", "north", "south", "east", "west"],
      message: "Please select valid location",
    },
  },
  worshipTeam: { worshipTeam },
});

const requiredDates = new mongoose.Schema({
  eventName: {
    type: String,
    trim: true,
    enum: {
      values: ["sunday", "kids-conference", "bible-college", "other"],
      message: "Event name is not available",
    },
  },
  sermonTopic: {
    type: String,
  },
  eventDate: {
    type: String,
    required: true,
  },
});

const submissions = new mongoose.Schema({
  userId: String,
  hasSubmittedDates: { type: Boolean, default: false },
  submittedDates: [requiredDates],
});

const RosterSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: [true, "Please enter the month and year of the roster"],
      unique: true,
    },
    name: String,
    requiredDates: [requiredDates],
    submissions: [submissions],
    roster: [plannedLocationRoster],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roster", RosterSchema);
