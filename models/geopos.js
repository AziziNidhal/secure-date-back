const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GeoPosSchema = new Schema({
    long: {
        type: String,
        required: true,
    },
    lat: {
        type: String,
        required: true,
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

module.exports = mongoose.model("GeoPos", GeoPosSchema);
