const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const GeoLocationSchema = require("./geoLocation.model");

// define Mongoose schema and model - User
const userSchema = new mongoose.Schema({
    id: String, // user-defined ID: required field
    name: String, // user's name: required field
    password: String,
    dob: String, // date of birth: mm/dd/yyyy format
    address: String, // user's address
    location: {
        type: GeoLocationSchema,
        index: "2dsphere"
    }, // user's exact location with longitude and latitude
    description: String, // user's description
    refreshToken: String, // for authentication purpose
    roles: [
        {
            type: String,
            ref: "Role"
        }
    ] // user role(s)
}, { collection: 'users' });

userSchema.index({ id: 1 });
userSchema.set('timestamps', true);
const User = mongoose.model("User", userSchema);

module.exports = User;
