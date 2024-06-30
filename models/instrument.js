const mongoose = require("mongoose");

const InstrumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Instrument = mongoose.model("Instrument", InstrumentSchema);
module.exports = { Instrument, InstrumentSchema };
