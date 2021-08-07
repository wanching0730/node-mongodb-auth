const mongoose = require("mongoose");

// define Mongoose model - Role (admin)
const Role = mongoose.model(
    "Role",
    new mongoose.Schema({
        name: String // role's name
    }, { collection: 'roles' })
);

module.exports = Role;
