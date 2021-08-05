/*
CRUD for User collection
*/

const bcrypt = require("bcryptjs");

const db = require("../models");
const User = db.user;
const Role = db.role;

const {validateDOB} = require("../utils/validate");
const CustomError = require("../utils/custom-error");
const logger = require("../utils/logger")(__filename)

// Create and Save a new user
module.exports = {
    createOne: (req, res) => {
        let author = req.url.includes("admin") ? "Admin" : "User";
        logger.info(`${author}: Creating new user`);

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
        let author = req.url.includes("admin") ? "Admin" : "User";
        logger.info(`${author}: Retrieving one user`);

        let id = req.params.id ? req.params.id : res.locals.id;

        return User.findOne({id: id})
            .populate("roles", "-__v")
            .then(user => {
                if(!user) throw new CustomError(404, `User not found with user ID ${id}`)

                res.send(user);
            });
    },
    // Update a user identified by the user ID in the request
    updateOne: (req, res) => {
        let author = req.url.includes("admin") ? "Admin" : "User";
        logger.info(`${author}: Updating one user`);

        let id = req.params.id ? req.params.id : res.locals.id;

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
        let author = req.url.includes("admin") ? "Admin" : "User";
        logger.info(`${author}: Deleting one user`);

        let id = req.params.id ? req.params.id : res.locals.id;
        User.deleteOne({id: id})
            .then(() => {
                res.status(200).send({message: "User was deleted successfully"});
            }).catch(err => {
                if(err.name === 'NotFound') throw new CustomError(400, `User not found with user ID ${id}`);
            });
    }
};

