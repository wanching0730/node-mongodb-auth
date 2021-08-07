/*
1. Check duplications for user ID
2. Check if roles in request exists in our database or not
*/

const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const CustomError = require("../utils/custom-error");
const logger = require("../utils/logger")(__filename);

module.exports = {
    // check duplications for user ID
    verifyNewUser: async (req, res, next) => {
        logger.audit("Verifying new user");

        // check duplicate username
        const user = await User.findOne({id: req.body.id}).exec();

        if (user) throw new CustomError(400, "Error: User ID is already in used");
        next();
    },
    // check if roles in request exists in our database or not
    verifyRoles: (req, res, next) => {
        logger.audit("Verifying new user's role");

        // compare the provided role with the roles in our database
        if (req.body.roles) {
            for (let i = 0; i < req.body.roles.length; i++) {
                if (!ROLES.includes(req.body.roles[i]))
                    throw new CustomError(400, `Error: Role ${req.body.roles[i]} does not exist`);
            }
            next();
        }
        next();
    }
}
