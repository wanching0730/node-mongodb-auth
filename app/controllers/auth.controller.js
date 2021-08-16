/*
1. Register: Save new user's details, save new user's role
2. Login: Check whether user exists in database, verify password, generate an access token and return to user
*/

const jwt = require("jsonwebtoken");
const { TokenExpiredError, JsonWebTokenError } = jwt;

const db = require("../models");
const User = db.user;
const ROLES = db.ROLES;

const CustomError = require("../utils/custom-error");
const logger = require("../utils/logger")(__filename);

const {asyncHandler} = require("../utils/error-handler");
const {validateDOB, validatePassword} = require("../utils/validate");
const {register, login} = require("../services/auth.service");
const {updateOne, findOne} = require("../services/user.service");
const {secret, jwtExpiration, jwtRefreshExpiration} = require("../config/auth.config");

module.exports = {
    register: async (req, res) => {
        const author = req.url.includes("admin") ? "Admin" : "User";
        logger.audit(`${author}: Registering new user`);

        await verifyNewUser(req.body.id);
        await verifyRoles(req.body.roles);

        const {id, name, password, dob, address, location, description} = req.body;

        // Validate request before passing to database
        // check user ID
        if (!id) throw new CustomError(400, "Error: User ID cannot be empty for registration");

        // check user name
        if (!name) throw new CustomError(400, "Error: User name cannot be empty for registration");

        // check password format
        if (!validatePassword(password)) throw new CustomError(400, "Error: Password should be in alphanumeric format");

        // check D.O.B format
        if (!validateDOB(dob)) throw new CustomError(400, "Error: Date of Birth should be in mm/dd/yyyy format");

        const user = new User({
            id: id,
            name: name,
            password: password,
            dob: dob,
            address: address,
            location: location,
            description: description
        });

        await register(user, req.body.roles);
        res.status(200).send({message: "User was registered successfully"});
    },

    login: async (req, res) => {
        const {id, password} = req.body;

        logger.audit(`User ${id} is logging in`)

        // check user ID
        if (!id) throw new CustomError(400, "Error: User ID cannot be empty for authentication");

        // check user password
        if (!password) throw new CustomError(400, "Error: User password cannot be empty for authentication");

        const {statusCode, body} = await login(id, password);
        res.status(statusCode).send({body});
    },

    logout: async (req, res) => {
        const {id} = req.body;

        logger.audit(`User ${id} is logging out`);

        await updateOne(id, {refreshToken: ""});
        logger.audit("User's refresh token is being removed from database successfully");

        logger.audit(`User ${id} logged out successfully`);
        res.status(200).send({message: `User ${id} logged out successfully`});
    },

    refreshToken: (req, res) => {
        return jwt.verify(req.body.refreshToken, secret, async (err, decoded) => {
            if (err instanceof TokenExpiredError) throw new CustomError(401, "Error: Refresh token was expired");
            if (err instanceof JsonWebTokenError) throw new CustomError(401, "Error: Invalid refresh token");

            const {id, roles, refreshToken} = await findOne(decoded.id);

            if(refreshToken !== req.body.refreshToken)
                throw new CustomError(401, "Error: Invalid refresh token");

            // generate new access token with user's ID and user's roles
            const newToken = jwt.sign({ id: id, roles: roles.map(r => r.name) }, secret, {
                expiresIn: jwtExpiration
            });

            // generate new refresh token with user's ID
            const newRefreshToken = jwt.sign({ id: id }, secret, {
                expiresIn: jwtRefreshExpiration
            });

            logger.audit(`New access token and refresh token are generated successfully`);

            await updateOne(id, {refreshToken: newRefreshToken});
            logger.audit(`New refresh token is updated to database successfully`);

            res.status(200).send({accessToken: newToken, refreshToken: newRefreshToken});
        });
    }
};

async function verifyNewUser(id) {
    logger.audit("Verifying new user");

    // check duplicate username
    const user = await User.findOne({id}).exec();

    if (user) throw new CustomError(400, "Error: User ID is already in used");
}

async function verifyRoles(roles) {
    logger.audit("Verifying new user's role");

    // compare the provided role with the roles in our database
    if (roles) {
        const validRole = ROLES.some(r => roles.indexOf(r) >= 0);

        if (!validRole) throw new CustomError(400, `Error: Role ${roles[i]} does not exist`);
    }
}


