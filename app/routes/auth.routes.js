const {verifyNewUser, verifyRoles} = require("../middleware/verifyRegistration");
const {verifyToken} = require("../middleware/authenticate");
const {login, register, logout, refreshToken} = require("../controllers/auth.controller");
const {asyncHandler} = require("../utils/error-handler");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/auth/register", [asyncHandler(verifyNewUser), asyncHandler(verifyRoles)], asyncHandler(register));
    app.post("/auth/login", asyncHandler(login));
    app.post("/auth/logout", [asyncHandler(verifyToken)], asyncHandler(logout));
    app.post("/auth/refreshToken", asyncHandler(refreshToken));
};
