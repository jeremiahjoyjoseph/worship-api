const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
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
});

const Event = mongoose.model("Event", EventSchema);
module.exports = { Event, EventSchema };
