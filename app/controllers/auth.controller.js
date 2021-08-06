/*
1. Register: Save new user's details, save new user's role
2. Login: Check whether user exists in database, verify password, generate an access token and return to user
*/

const db = require("../models");
const User = db.user;

const {validateDOB} = require("../utils/validate");
const CustomError = require("../utils/custom-error");
const logger = require("../utils/logger")(__filename);
const {register, login} = require("../services/auth.service");

module.exports = {
    register: async (req, res) => {
        const author = req.url.includes("admin") ? "Admin" : "User";
        logger.audit(`${author}: Registering new user`);

        const {id, name, password, dob, address, description} = req.body;

        // Validate request before passing to database
        // check user ID
        if (!id) throw new CustomError(400, "Error: User ID cannot be empty for registration");

        // check user name
        if (!name) throw new CustomError(400, "Error: User name cannot be empty for registration");

        // check D.O.B format
        if (!validateDOB) throw new CustomError(400, "Error: Date of Birth should be in mm/dd/yyyy format");


        const user = new User({
            id: id,
            name: name,
            password: password,
            dob: dob,
            address: address,
            description: description
        });

        const {statusCode, message} = await register(user, req.body.roles);
        res.status(statusCode).send({message: message});
    },

    login: async (req, res) => {
        const {id, password} = req.body;

        logger.audit(`User ${id} logging in`)

        // check user ID
        if (!id) throw new CustomError(400, "Error: User ID cannot be empty for authentication");

        // check user password
        if (!password) throw new CustomError(400, "Error: User password cannot be empty for authentication");

        const {statusCode, body} = await login(id, password);
        res.status(statusCode).send({body});
    }
};


