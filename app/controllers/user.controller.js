/*
CRUD for User collection
*/

const bcrypt = require("bcryptjs");

const db = require("../models");
const User = db.user;

const CustomError = require("../utils/custom-error");
const logger = require("../utils/logger")(__filename)

module.exports = {
    // Retrieve and return all users
    findAll: (req, res) => {
        logger.info("Admin: Retrieving all users");
        User.find()
            .then(users => {
                res.send(users);
            });
    },

    // Find a single user with a user ID
    findOne: (req, res) => {
        let id = req.params.id ? req.params.id : res.locals.id;
        let author = req.url.includes("admin") ? "Admin" : res.locals.id;
        logger.info(`${author}: Retrieving one user`);

        return User.findOne({id: id})
            .populate("roles", "-__v")
            .then(user => {
                if(!user) throw new CustomError(404, `User not found with user ID ${id}`)

                res.send(user);
            });
    },

    // Update a user identified by the user ID in the request
    updateOne: (req, res) => {
        let id = req.params.id ? req.params.id : res.locals.id;
        let author = req.url.includes("admin") ? "Admin" : res.locals.id;
        logger.info(`${author}: Updating one user`);

        // check user ID
        if(!id) throw new CustomError(400, "Error: User ID cannot be empty");

        // check user name
        if(!req.body.name) throw new CustomError(400, "Error: User name cannot be empty");

        // check D.O.B format
        if(!validateDOB) throw new CustomError(400, "Error: Date of Birth should be in mm/dd/yyyy format");

        User.findOne({id: id})
            .then(user => {
                if(!user) throw new CustomError(404, `User not found with user ID ${id}`);

                user.name = req.body.name,
                user.dob = req.body.dob,
                user.address = req.body.address,
                user.description = req.body.description

                user.save()
                    .then(() => {
                        res.status(200).send({message: "User was updated successfully"});
                    });
            });
    },

    // Delete a user with the specified user ID in the request
    deleteOne: (req, res) => {
        let id = req.params.id ? req.params.id : res.locals.id;
        let author = req.url.includes("admin") ? "Admin" : res.locals.id;
        logger.info(`${author}: Deleting one user`);

        User.deleteOne({id: id})
            .then(() => {
                res.status(200).send({message: "User was deleted successfully"});
            }).catch(err => {
                if(err.name === 'NotFound') throw new CustomError(400, `User not found with user ID ${id}`);
            });
    }
};

