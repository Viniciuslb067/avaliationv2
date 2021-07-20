const mongoose = require("../database");

const EntrieSchema = new mongoose.Schema({
  ip_user: {
    type: String,
    required: true,
  },
  system: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "System",
    required: true,
  },
  entry: {
    type: Date,
    default: Date.now,
  },
});

const Entrie = mongoose.model("Entrie", EntrieSchema);
module.exports = Entrie;
