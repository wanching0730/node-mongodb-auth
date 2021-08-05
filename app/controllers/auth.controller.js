/*
1. Register: Save new user's details, save new user's role
2. Login: Check whether user exists in database, verify password, generate an access token and return to user
*/

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

const controller = require("../controllers/user.controller");
const CustomError = require("../utils/custom-error");
const logger = require("../utils/logger")(__filename)

module.exports = {
    login: (req, res) => {
        logger.audit(`User ${req.body.id} logging in`)
        // check whether user exists in database
        User.findOne({
            id: req.body.id
        })
        .populate("roles", "-__v")
        .exec()
        .then(user => {
            if (!user) throw new CustomError(401, "Error: User not found.");

            // verify password
            let passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({accessToken: null, message: "Error: Invalid password"});
                logger.error("Error: Invalid password")
            }

            // generate new access token
            let token = jwt.sign({ id: user.id, roles: user.roles.map(r => r.name) }, config.secret, {
                expiresIn: 3600 // 1 hour
            });

            let authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push(user.roles[i].name);
            }

            logger.audit(`User ${req.body.id} logged in successfully`)
            res.status(200).send({
                id: user.user_id,
                name: user.name,
                roles: authorities,
                accessToken: token
            });
        });
    }
};


