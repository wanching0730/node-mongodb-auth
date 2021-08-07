const {asyncHandler} = require("../utils/error-handler");
const {createFollowing, findFollowers, findFollowing} = require("../controllers/follow.controller");

module.exports = function(app) {
    app.post("/users/following", asyncHandler(createFollowing));
    app.get("/users/following/:id", asyncHandler(findFollowing));
    app.get("/users/followers/:id", asyncHandler(findFollowers));
};
