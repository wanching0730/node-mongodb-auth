const { verifyToken } = require("../middleware/authenticate");
const {findOne, createOne, updateOne, deleteOne} = require("../controllers/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // routes for normal user: Only can select, create, update, delete own record
    app.use("/users", [verifyToken])
    app.get("/users", findOne);
    app.post("/users", createOne);
    app.put("/users", updateOne);
    app.delete("/users", deleteOne);
};
