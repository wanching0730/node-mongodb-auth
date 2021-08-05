const mongoose = require("mongoose");

// define Mongoose model - User
const User = mongoose.model(
    "User",
    new mongoose.Schema({
        id: String // user-defined ID: required field
        name: String, // user name: required field
        password: String,
        dob: String, // date of birth: mm/dd/yyyy format
        address: String, // user address
        description: String, // user description
        createdAt: Str  ing, // user created date
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ] // user role(s)
    })
);

module.exports = User;
