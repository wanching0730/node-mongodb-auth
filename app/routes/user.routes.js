const { verifyToken } = require("../middleware/authenticate");
const { isAdmin } = require("../middleware/authorize");
const {findAll, findOne, createOne, updateOne, deleteOne} = require("../controllers/user.controller");
const {asyncHandler} = require("../utils/error-handler")

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // routes for normal user: Only can select, update, delete own record
    app.use("/users", [verifyToken])
    app.get("/users", findOne);
    app.post("/users", createOne);
    app.put("/users", updateOne);
    app.delete("/users", deleteOne);

    // routes for admin: Can select single record, select all records, update, delete any record
    app.use("/admin/users", [verifyToken, isAdmin])
    app.get("/admin/users/:id", asyncHandler(findOne));
    app.get("/admin/users", findAll);
    app.post("/admin/users", createOne);
    app.put("/admin/users/:id", updateOne);
    app.delete("/admin/users/:id", deleteOne);
};
