const mongoose = require("../database");

const ResultSchema = new mongoose.Schema({
    ip_user: {
        type: String,
        required: true,
    },
    avaliation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Avaliation',
        required: true,
    },
    note:{
        
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
