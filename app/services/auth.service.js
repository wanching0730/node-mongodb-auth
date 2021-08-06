/*
Database logic for authentication
*/

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const CustomError = require("../utils/custom-error");
const logger = require("../utils/logger")(__filename);

module.exports = {
    register: (user, roles) => {

        // save user's roles by getting role_id from database
        if (roles) {
            // if user is admin
            logger.info("Database: Retrieving new user's role");

            return Role.find({name: {$in: roles}})
                .then(roles => {
                    user.roles = roles.map(role => role._id);

                    // save user's details
                    return user.save()
                        .then(() => {
                            return ({statusCode: 200, message: "User was registered successfully"});
                        })
                })
        } else {
            // if user is normal user
            logger.info("Database: Retrieving new user's role as normal user");

            return Role.findOne({name: "user"})
                .then(role => {
                    user.roles = [role._id];

                    // save user's details
                    return user.save()
                        .then(() => {
                            return ({statusCode: 200, message: "User was registered successfully"});
                        })
                });
        }
    },

    login: (id, password) => {
        // check whether user exists in database
        return User.findOne({
            id: id
        })
            .populate("roles", "-__v")
            .exec()
            .then(user => {
                if (!user) throw new CustomError(401, "Error: User not found.");

                // verify password
                let passwordIsValid = bcrypt.compareSync(
                    password,
                    user.password
                );

                if (!passwordIsValid) {
                    logger.error("Error: Invalid password");
                    throw new CustomError(401, "Error: Invalid password");
                }

                // generate new access token with user's ID and user's roles
                let token = jwt.sign({ id: user.id, roles: user.roles.map(r => r.name) }, config.secret, {
                    expiresIn: 3600 // 1 hour
                });

                let authorities = [];

                for (let i = 0; i < user.roles.length; i++) {
                    authorities.push(user.roles[i].name);
                }

                logger.audit(`User ${id} logged in successfully`)
                return({statusCode: 200, body: {
                    id: user.user_id,
                    name: user.name,
                    roles: authorities,
                    accessToken: token
                }});
            });
    }
};


