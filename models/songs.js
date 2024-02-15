const mongoose = require("mongoose");
const slugify = require("slugify");

const SongSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      lowercase: true,
      required: [true, "Please enter song title."],
      trim: true,
    },
    slug: String,
    artist: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Please enter artist name."],
    },
    youtubeLink: {
      type: String,
      validate: {
        validator: function (v) {
          return /^https:\/\/www.youtube.com\/.*$/.test(v);
        },
        message: (props) => `${props.value} is not a valid youtube link.`,
      },
      required: [true, "Youtube video link is required."],
    },
    chordSheetLink: {
      type: String,
    },
    lyricsLink: {
      type: String,
    },
    lyrics: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
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
