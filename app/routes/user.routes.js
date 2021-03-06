const { verifyToken } = require("../middleware/authenticate");
const { isAdmin } = require("../middleware/authorize");
const {findAll, findOne, updateOne, deleteOne, deleteAll} = require("../controllers/user.controller");
const {asyncHandler} = require("../utils/error-handler");

module.exports = function(app) {
    // routes for normal user: Only can select, update, delete own record only
    app.use("/users", [asyncHandler(verifyToken)]);
    app.get("/users", asyncHandler(findOne));
    app.put("/users", asyncHandler(updateOne));
    app.delete("/users", asyncHandler(deleteOne));

    // routes for admin: Can select single record, select all records, update, delete any record
    app.use("/admin/users", [asyncHandler(verifyToken), asyncHandler(isAdmin)]);
    app.get("/admin/users/:id", asyncHandler(findOne));
    app.get("/admin/users", asyncHandler(findAll));
    app.put("/admin/users/:id", asyncHandler(updateOne));
    app.delete("/admin/users/:id", asyncHandler(deleteOne));
    app.delete("/admin/users", asyncHandler(deleteAll));
};
