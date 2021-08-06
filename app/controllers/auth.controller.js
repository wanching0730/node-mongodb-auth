/*
1. Register: Save new user's details, save new user's role
2. Login: Check whether user exists in database, verify password, generate an access token and return to user
*/

const bcrypt = require("bcryptjs");

const db = require("../models");
const User = db.user;

const {validateDOB} = require("../utils/validate");
const CustomError = require("../utils/custom-error");
const logger = require("../utils/logger")(__filename);
const {register, login} = require("../services/auth.service");

module.exports = {
    register: async (req, res) => {
        let author = req.url.includes("admin") ? "Admin" : "User";
        logger.audit(`${author}: Registering new user`);

        // Validate request before passing to database
        // check user ID
        if (!req.body.id) throw new CustomError(400, "Error: User ID cannot be empty");

        // check user name
        if (!req.body.name) throw new CustomError(400, "Error: User name cannot be empty");

        // check D.O.B format
        if (!validateDOB) throw new CustomError(400, "Error: Date of Birth should be in mm/dd/yyyy format");

        const user = new User({
            id: req.body.id,
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password, 8),
            dob: req.body.dob,
            address: req.body.address,
            description: req.body.description
        });

        let {statusCode, message} = await register(user, req.body.roles);
        res.status(statusCode).send({message: message});
    },

    login: async (req, res) => {
        let id = req.body.id
        logger.audit(`User ${id} logging in`)

        // check user ID
        if (!id) throw new CustomError(400, "Error: User ID cannot be empty for authentication");

        // check user password
        if (!req.body.password) throw new CustomError(400, "Error: User password cannot be empty for authentication");

        let {statusCode, body} = await login(id, req.body.password);
        res.status(statusCode).send({body});
    }
};


