/*
Business logic and validation for User collection
*/

const db = require("../models");

const CustomError = require("../utils/custom-error");
const logger = require("../utils/logger")(__filename);
const {validateDOB} = require("../utils/validate");
const {findAll, findOne, updateOne, deleteOne, deleteAll} = require("../services/user.service");

module.exports = {
    // Retrieve and return all users
    findAll: async (req, res) => {
        logger.info("Admin: Retrieving all users");
        res.send(await findAll());
    },

    // Find a single user with a user ID
    findOne: async (req, res) => {
        let id = req.params.id ? req.params.id : res.locals.id;
        let author = req.url.includes("admin") ? "Admin" : res.locals.id;
        logger.info(`${author}: Retrieving one user`);

        res.send(await findOne(id));
    },

    // Update a user identified by the user ID in the request
    updateOne: async (req, res) => {
        let id = req.params.id ? req.params.id : res.locals.id;
        let author = req.url.includes("admin") ? "Admin" : res.locals.id;
        logger.info(`${author}: Updating one user`);

        // check user ID
        if (!id) throw new CustomError(400, "Error: User ID cannot be empty");

        // check user name
        if (!req.body.name) throw new CustomError(400, "Error: User name cannot be empty");

        // check D.O.B format
        if (!validateDOB) throw new CustomError(400, "Error: Date of Birth should be in mm/dd/yyyy format");

        let {statusCode, message} = await updateOne(id, req.body);
        res.status(statusCode).send({message: message});
    },

    // Delete a user with the specified user ID in the request
    deleteOne: async (req, res) => {
        let id = req.params.id ? req.params.id : res.locals.id;
        let author = req.url.includes("admin") ? "Admin" : res.locals.id;
        logger.info(`${author}: Deleting one user`);

        let {statusCode, message} = await deleteOne(id);
        res.status(statusCode).send({message: message});
    },

    // Delete all users
    deleteAll: async (req, res) => {
        logger.info("Admin: Deleting all user");

        let {statusCode, message} = await deleteAll();
        res.status(statusCode).send({message: message});
    }
};

