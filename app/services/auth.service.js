/*
Database logic for authentication
*/

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {secret, jwtExpiration, jwtRefreshExpiration} = require("../config/auth.config");
const {updateOne} = require("../services/user.service");
const {validateDOB, validatePassword} = require("../utils/validate");

const db = require("../models");
const User = db.user;
const Role = db.role;

const CustomError = require("../utils/custom-error");
const logger = require("../utils/logger")(__filename);

module.exports = {
    register: async (user, roles) => {
        if (!user.id) throw new CustomError(400, "Error: User ID cannot be empty for registration");
        if (!user.name) throw new CustomError(400, "Error: User name cannot be empty for registration");
        //if (!validatePassword(user.password)) throw new CustomError(400, "Error: Password should be in alphanumeric format");
        if (!validateDOB(user.dob)) throw new CustomError(400, "Error: Date of Birth should be in mm/dd/yyyy format");

        // save user's roles by getting role_id from database
        if (roles) {
            // if user is admin
            logger.info("Database: Retrieving new user's role");

            let validRoles = await Role.find({name: {$in: roles}});
            if (validRoles.length === 0) throw new CustomError(400, "Error: Roles provided are invalid");

            // save user's details
            user.roles = validRoles.map(role => role._id);
            user.password = bcrypt.hashSync(user.password, 8);
            await User.create(user);

            return ({statusCode: 200, message: "User was registered successfully"});
        } else {
            // if user is normal user
            logger.info("Database: Retrieving new user's role as normal user");

            let validRole = await Role.findOne({name: "user"});
            user.roles = [validRole._id];
            user.password = bcrypt.hashSync(user.password, 8);
            await User.create(user);

            return ({statusCode: 200, message: "User was registered successfully"});
        }
    },

    login: async (id, password) => {
        if (!id) throw new CustomError(400, "Error: User ID cannot be empty for authentication");
        if (!password) throw new CustomError(400, "Error: User password cannot be empty for authentication");

        // check whether user exists in database
        let user = await User.findOne({id: id})
            .populate("roles", "-__v")
            .exec();

        if (!user) throw new CustomError(401, "Error: Invalid user");

        // verify password
        let passwordIsValid = bcrypt.compareSync(
            password,
            user.password
        );

        if (!passwordIsValid) {
            logger.error("Error: Invalid password");
            throw new CustomError(401, "Error: Invalid password");
        }

        // generate access token with user's ID and user's roles
        const token = jwt.sign({id: user.id, roles: user.roles.map(r => r.name)}, secret, {
            expiresIn: jwtExpiration // 1 hour
        });

        // generate refresh token with user's ID
        const refreshToken = jwt.sign({id: user.id}, secret, {
            expiresIn: jwtRefreshExpiration // 24 hours
        });

        // update user's refresh token in database
        await updateOne(id, {refreshToken: refreshToken});
        logger.audit(`Refresh token is updated to database successfully`);

        // populate user's roles
        let authorities = [];
        for (let i = 0; i < user.roles.length; i++) {
            authorities.push(user.roles[i].name);
        }

        logger.audit(`User ${id} logged in successfully`)
        return ({
            statusCode: 200, body: {
                id: user.id, name: user.name, roles: authorities,
                accessToken: token, refreshToken: refreshToken
            }
        });
    }
};


