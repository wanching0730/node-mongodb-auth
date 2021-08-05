/*
1. Authorization: Check if user's role is the required roles or not
(In this case, it must be admin role)
*/

const CustomError = require("../utils/custom-error");

module.exports = {
    isAdmin: (req, res, next) => {
        if(res.locals.roles.includes("admin")) {
            next();
            return;
        }

        throw new CustomError(403, "Error: Admin role is required");
        return;
    }
};
