const mongoose = require("../database");

const QuestionSchema = new mongoose.Schema({
    question: {
      type: String,
      required: true,
    },
    // assessment: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Avaliation',
    //   required: true,
    // },
});

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
