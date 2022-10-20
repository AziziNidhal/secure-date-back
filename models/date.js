const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DateSchema = new Schema({
    dateIdentifier: {
        type: String,
        required: true,
    },
    start: {
        type: Number,
        required: true,
    },
    haveToAlert: {
        type: Number,
        required: true,
    },
    intervalMs: {
        type: Number,
        required: true,
    },
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "Subscriber",
        required: true,
    },
    saverHasBeenNotified: {
        type: Boolean,
        required: true,
    },

});

module.exports = mongoose.model("Date", DateSchema);
