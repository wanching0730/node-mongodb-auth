const {verifyNewUser, verifyRoles} = require("../middleware/verifyRegistration");
const {refreshToken} = require("../middleware/authenticate");
const {login, register} = require("../controllers/auth.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/auth/register", [verifyNewUser, verifyRoles], register);
    app.post("/auth/login", login);
    app.post("/auth/refreshToken", refreshToken);
};
