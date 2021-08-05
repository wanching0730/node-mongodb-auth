const { authenticate } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // routes for normal user: Only can select, create, update, delete own record
    app.use("/users", [authenticate.verifyToken])
    app.get("/users", controller.findOne);
    app.post("/users", controller.createOne);
    app.put("/users", controller.updateOne);
    app.delete("/users", controller.deleteOne);
};
