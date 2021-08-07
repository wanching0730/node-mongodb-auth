const {verifyToken} = require("../middleware/authenticate");
const {login, register, logout, refreshToken} = require("../controllers/auth.controller");
const {asyncHandler} = require("../utils/error-handler");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/auth/register", asyncHandler(register));
    app.post("/auth/login", asyncHandler(login));
    app.post("/auth/logout", [asyncHandler(verifyToken)], asyncHandler(logout));
    app.post("/auth/refreshToken", asyncHandler(refreshToken));
};
