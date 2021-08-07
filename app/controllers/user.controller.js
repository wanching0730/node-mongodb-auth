/*
Business logic and validation for User collection
*/

const CustomError = require("../utils/custom-error");
const logger = require("../utils/logger")(__filename);

const {validateDOB} = require("../utils/validate");
const {findAll, findOne, updateOne, deleteOne, deleteAll} = require("../services/user.service");

module.exports = {
    // Retrieve and return all users
    findAll: async (req, res) => {
        logger.info("Admin: Retrieving all users");
        res.status(200).send(await findAll());
    },

    // Find a single user with a user ID
    findOne: async (req, res) => {
        const id = req.params.id ? req.params.id : res.locals.id;

        const author = req.url.includes("admin") ? "Admin" : res.locals.id;
        logger.info(`${author}: Retrieving one user`);

        res.status(200).send(await findOne(id));
    },

    // Update a user identified by the user ID in the request
    updateOne: async (req, res) => {
        const id = req.params.id ? req.params.id : res.locals.id;

        const author = req.url.includes("admin") ? "Admin" : res.locals.id;
        logger.info(`${author}: Updating one user`);

        // check user ID
        if (!id) throw new CustomError(400, "Error: User ID cannot be empty");

        // check user name
        if (!req.body.name) throw new CustomError(400, "Error: User name cannot be empty");

        // check D.O.B format
        if (!validateDOB(req.body.dob)) throw new CustomError(400, "Error: Date of Birth should be in mm/dd/yyyy format");

        await updateOne(id, req.body);
        res.status(200).send({message: "User was updated successfully"});
    },

    // Delete a user with the specified user ID in the request
    deleteOne: async (req, res) => {
        const id = req.params.id ? req.params.id : res.locals.id;

        const author = req.url.includes("admin") ? "Admin" : res.locals.id;
        logger.info(`${author}: Deleting one user`);

        await deleteOne(id);
        res.status(200).send({message: "User was deleted successfully"});
    },

    // Delete all users
    deleteAll: async (req, res) => {
        logger.info("Admin: Deleting all user");

        await deleteAll();
        res.status(200).send({message: "All users were deleted successfully"});
    }
};

