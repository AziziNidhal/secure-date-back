const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subscriberSchema = new Schema({
    mid: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    emergencyText: {
        type: String,
        required: false,
    },
    saverFullname: {
        type: String,
        required: false,
    },
    saverEmail: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    saverEmailValidated: {
        type: Boolean,
        default: false,
    },
    tracabilityKey: {
        type: String,
        required: false,
    },
    validationKey: {
        type: String,
        required: false,
    },

    alertList: [
        {
            type: Schema.Types.ObjectId,
            ref: "Alert",
        },
    ],

});

module.exports = mongoose.model("Subscriber", subscriberSchema);
