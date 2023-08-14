const mongoose = require("mongoose");

const songsSchema = new mongoose.Schema(
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
    contributor: {
      type: [String],
      lowercase: true,
      trim: true,
    },
    youtubeLink: {
      type: String,
      trim: true,
      required: [true, "Please provide youtube link."],
    },
    spotifyLink: {
      type: String,
      trim: true,
    },
    chordsReferenceLink: {
      type: String,
      trim: true,
    },
  },
  { timestamp: true }
);
