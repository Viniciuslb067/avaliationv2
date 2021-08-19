const mongoose = require("../database");

const LgpdSchema = new mongoose.Schema({
  ip_user: {
    type: String,
    required: true,
  },
  browser: {
    type: String,
    required: true,
  },
  os_system: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Lgpd = mongoose.model("Lgpd", LgpdSchema);
module.exports = Lgpd;
