const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AlertSchema = new Schema({
    tracabilityCode: {
        type: String,
        required: true,
    },
    creationTime: {
        type: String,
        required: false,
    },
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "Subscriber",
        required: true,
    },

});

module.exports = mongoose.model("Alert", AlertSchema);
