const mongoose = require("mongoose");

// define Mongoose model - User
const User = mongoose.model(
    "User",
    new mongoose.Schema({
        id: String, // user ID
        username: String, // user name
        dob: String, // date of birth
        address: String, // user address
        description: String, // user description
        createdAt: String, // user created date
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ] // user role(s)
    })
);

module.exports = User;
