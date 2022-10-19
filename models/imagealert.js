const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ImageAlertSchema = new Schema({
    imageUrl: {
        type: String,
        required: false,
    },

    timestamp: {
        type: String,
        required: false,
    },
    alert: {
        type: Schema.Types.ObjectId,
        ref: "Alert",
        required: true,
    },
});

module.exports = mongoose.model("ImageAlert", ImageAlertSchema);
