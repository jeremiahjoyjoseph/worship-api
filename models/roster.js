const mongoose = require("mongoose");

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

const plannedRoster = mongoose.Schema({
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

const sundaysOfMonth = new mongoose.Schema({
  sermonTopic: {
    type: String,
  },
  sundayDate: {
    type: String,
  },
});

const submissions = new mongoose.Schema({
  id: {
    type: String,
  },
  hasSubmittedDates: { type: Boolean, default: false },
  submittedDates: [sundaysOfMonth],
});

const RosterSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: [true, "Please enter the month and year of the roster"],
    },
    sundaysOfMonth: [sundaysOfMonth],
    submissions: [submissions],
    roster: { plannedRoster },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roster", RosterSchema);
