const mongoose = require("mongoose");

const BandRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    require: true,
  },
});

const BandRole = mongoose.model("BandRole", BandRoleSchema);
module.exports = { BandRole, BandRoleSchema };
