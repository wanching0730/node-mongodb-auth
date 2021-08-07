const mongoose = require("mongoose");

// define Mongoose schema and model - Following
const followingSchema = new mongoose.Schema({
    user_id: String, // user-defined ID: required field
    following_id: String, // the target user's ID that this user is following: required field
}, { collection: 'following' });

followingSchema.index({ user_id: 1 });
followingSchema.index({ following_id: 1 });
const Following = mongoose.model("Following", followingSchema);

module.exports = Following;
