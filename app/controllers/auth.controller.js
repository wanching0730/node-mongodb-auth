/*
1. Register: Save new user's details, save new user's role
2. Login: Check whether user exists in database, verify password, generate an access token and return to user
*/

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const controller = require("../controllers/user.controller");
const {validateDOB} = require("../utils/validate");
const CustomError = require("../utils/custom-error");
const logger = require("../utils/logger")(__filename)

module.exports = {
    register: (req, res) => {
        let author = req.url.includes("admin") ? "Admin" : "User";
        logger.audit(`${author}: Registering new user`);

        // Validate request before passing to database
        // check user ID
        if(!req.body.id) throw new CustomError(400, "Error: User ID cannot be empty");

        // check user name
        if(!req.body.name) throw new CustomError(400, "Error: User name cannot be empty");

        // check D.O.B format
        if(!validateDOB) throw new CustomError(400, "Error: Date of Birth should be in mm/dd/yyyy format");

        const user = new User({
            id: req.body.id,
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password, 8),
            dob: req.body.dob,
            address: req.body.address,
            description: req.body.description
        });

        // save user's roles by getting role_id from database
        if (req.body.roles) {
            // if user is admin
            logger.info("Database: Retrieving new user's role");

            Role.find({name: {$in: req.body.roles}})
                .then(roles => {
                    user.roles = roles.map(role => role._id);

                    // save user's details
                    user.save()
                        .then(() => res.status(200).send({message: "User was registered successfully"}))
                })
        } else {
            // if user is normal user
            logger.info("Database: Retrieving new user's role as normal user");

            Role.findOne({name: "user"})
                .then(role => {
                    user.roles = [role._id];

                    // save user's details
                    user.save()
                        .then(() => res.status(200).send({message: "User was registered successfully"}))
                });
        }
    },

    login: (req, res) => {
        let id = req.body.id
        logger.audit(`User ${id} logging in`)

        // check user ID
        if(!id) throw new CustomError(400, "Error: User ID cannot be empty for authentication");

        // check user password
        if(!req.body.password) throw new CustomError(400, "Error: User password cannot be empty for authentication");

        // check whether user exists in database
        User.findOne({
            id: id
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

            // generate new access token with user's ID and user's roles
            let token = jwt.sign({ id: user.id, roles: user.roles.map(r => r.name) }, config.secret, {
                expiresIn: 3600 // 1 hour
            });

            let authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push(user.roles[i].name);
            }

            logger.audit(`User ${id} logged in successfully`)
            res.status(200).send({
                id: user.user_id,
                name: user.name,
                roles: authorities,
                accessToken: token
            });
        });
    }
};


