/*
Authorization: Check if user's role is the required roles or not
(In this case, it must be admin role)
*/

const CustomError = require("../utils/custom-error");
const logger = require("../utils/logger")(__filename);

module.exports = {
    isAdmin: (req, res, next) => {
        if(res.locals.roles.includes("admin")) {
            logger.audit(`User ${res.locals.id} is authorised as Admin`);
            next();
            return;
        }

        throw new CustomError(403, "Error: Admin role is required for this action");
    }
};
