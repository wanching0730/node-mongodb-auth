const { verifyNewUser, verifyRoles } = require("../middleware/verifyRegistration");
const {login} = require("../controllers/auth.controller");
const {createOne} = require("../controllers/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/auth/register",
        [
            verifyNewUser,
            verifyRoles
        ],
        createOne
    );

    app.post("/auth/login", login);
};
