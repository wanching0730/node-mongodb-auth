const mongoose = require("mongoose");

// define Mongoose schema - User's GeoLocation
const GeoLocationSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'Point'
    },
    coordinates: {
        type: [Number]
    }
});

module.exports = GeoLocationSchema;
