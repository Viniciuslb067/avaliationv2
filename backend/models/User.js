const mongoose = require("../database");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  cpf: {
    type: String,
    unique: true,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// UserSchema.pre("save", async function (next) {
//   const hash = await bcrypt.hash(this.password, 10);
//   this.password = hash;

//   next();
// });

const User = mongoose.model("User", UserSchema);
module.exports = User;
