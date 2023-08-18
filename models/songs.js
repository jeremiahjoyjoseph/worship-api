const mongoose = require("mongoose");
const slugify = require("slugify");

const SongSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      lowercase: true,
      required: [true, "Please enter song title."],
      trim: true,
      maxLength: [100, "Song title cannot exceed 100 characters"],
    },
    slug: String,
    artist: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Please enter artist name."],
      maxLength: [100, "Song artist name cannot exceed 100 characters"],
    },
  },
  { timestamps: true }
);

//Creating song slug before saving
SongSchema.pre("save", function (next) {
  //Creating slug before saving to DB
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Songs", SongSchema);
