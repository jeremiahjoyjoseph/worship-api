const mongoose = require("mongoose");

export const BandRoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BandRole", BandRoleSchema);
