const {asyncHandler} = require("../utils/error-handler");
const {createFollowing, findFollowers, findFollowing} = require("../controllers/follow.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/users/following", asyncHandler(createFollowing));
    app.get("/users/following/:id", asyncHandler(findFollowing));
    app.get("/users/followers/:id", asyncHandler(findFollowers));
};
