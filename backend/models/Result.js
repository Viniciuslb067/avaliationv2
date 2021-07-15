const mongoose = require("../database");

const ResultSchema = new mongoose.Schema({
  ip_user: {
    type: String,
    required: true,
  },
  browser: {
    type: String,
    required: true,
  },
  system: {
    type: String,
    required: true,
  },
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assessment",
    required: true,
  },
  note: {
    type: Number,
  },
  comments: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Result = mongoose.model("Result", ResultSchema);
module.exports = Result;
