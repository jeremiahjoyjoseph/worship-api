const mongoose = require("mongoose");
const slugify = require("slugify");

const LocationSchema = new mongoose.Schema(
  {
    location: [locationSchema],
  },
  { timestamps: true }
);

const locationSchema = new mongoose.Schema({
  name: { type: String },
  mdRequired: { type: Boolean },
  instrumentsRequired: {
    type: Array,
    enum: {
      values: ["drums", "keys", "acoustic", "bass", "electric"],
      message: "Please select valid instrument",
    },
  },
});

//Creating slug before saving
LocationSchema.pre("save", function (next) {
  //Creating slug before saving to DB
  this.slug = slugify(``, { lower: true });
  next();
});

module.exports = mongoose.model("Location", LocationSchema);
