const mongoose = require("mongoose");
const { LocationSchema } = require("./location");

const EventSchema = new mongoose.Schema(
  {
    eventDate: {
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
    location: LocationSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
