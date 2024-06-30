const mongoose = require("mongoose");

export const InstrumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Instrument", InstrumentSchema);
