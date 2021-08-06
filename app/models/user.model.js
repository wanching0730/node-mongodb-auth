const mongoose = require("mongoose");

// define Mongoose schema and model - User
const userSchema = new mongoose.Schema({
    id: String, // user-defined ID: required field
    name: String, // user name: required field
    password: String,
    dob: String, // date of birth: mm/dd/yyyy format
    address: String, // user address
    description: String, // user description
    refreshToken: String, // for authentication purpose
    roles: [
        {
            type: String,
            ref: "Role"
        }
    ] // user role(s)
}, { collection: 'users' });
userSchema.set('timestamps', true);
const User = mongoose.model("User", userSchema);

module.exports = User;
