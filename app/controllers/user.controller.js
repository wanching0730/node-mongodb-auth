/*
CRUD for User collection
*/
const bcrypt = require("bcryptjs");

const db = require("../models");
const User = db.user;
const Role = db.role;
const {validateDOB} = require("../utils/validate");

// Create and Save a new user
module.exports = {
    createOne: (req, res) => {
        console.log("Creating new user")
        // Validate request before passing to database

        // check user ID
        if(!req.body.id) return res.status(400).send({message: "Error: User ID cannot be empty"});

        // check user name
        if(!req.body.name) return res.status(400).send({message: "Error: User name cannot be empty"});

        // check D.O.B format
        if(!validateDOB) return res.status(400).send({message: "Error: Date of Birth should be in mm/dd/yyyy format"});

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
            console.log("Retrieving new user's role");

            Role.find({name: {$in: req.body.roles}})
                .then(roles => {
                    user.roles = roles.map(role => role._id);

                    // save user's details
                    user.save()
                        .then(() => res.status(200).send({message: "User was registered successfully"}))
                        .catch(err => {
                            res.status(500).send({message: "Errors occur when registering user: " + err});
                            return;
                        })
                }).catch(err => {
                    res.status(500).send({message: "Errors occur when Retrieving for new user's role from database: " + err});
                    return;
                })
        } else {
            // if user is normal user
            console.log("Retrieving new user's role as normal user");

            Role.findOne({name: "user"})
                .then(role => {
                    user.roles = [role._id];

                    // save user's details
                    user.save()
                        .then(() => res.status(200).send({message: "User was registered successfully"}))
                        .catch(err => {
                            res.status(500).send({message: "Errors occur when registering user: " + err});
                            return;
                        })
                })
                .catch(err => {
                    res.status(500).send({message: "Errors occur when Retrieving for new user's role from database: " + err});
                    return;
                })
        }
    },
    // Retrieve and return all users
    findAll: (req, res) => {
        console.log("Retrieving all users")
        User.find()
            .then(users => {
                res.send(users);
            }).catch(err => {
                res.status(500).send({message: "Errors occur when retrieving all users in database: " + err});
            });
    },
    // Find a single user with a user ID
    findOne: (req, res) => {
        console.log("Retrieving one user")
        let id = req.params.id ? req.params.id : res.locals.id;

        User.findOne({id: id})
            .populate("roles", "-__v")
            .then(user => {
                if(!user) return res.status(404).send({message: "User not found with user ID " + id});

                res.send(user);
            }).catch(err => {
                return res.status(500).send({message: "Errors occur when retrieving user with ID " + id});
        });
    },
    // Update a user identified by the user ID in the request
    updateOne: (req, res) => {
        console.log("Updating one user")
        let id = req.params.id ? req.params.id : res.locals.id;

        // check user ID
        if(!id) return res.status(400).send({message: "Error: User ID cannot be empty"});

        // check user name
        if(!req.body.name) return res.status(400).send({message: "Error: User name cannot be empty"});

        // check D.O.B format
        if(!validateDOB) return res.status(400).send({message: "Error: Date of Birth should be in mm/dd/yyyy format"});

        User.findOne({id: id})
            .then(user => {
                if(!user) return res.status(404).send({message: "User not found with ID " + id});

                user.name = req.body.name,
                user.dob = req.body.dob,
                user.address = req.body.address,
                user.description = req.body.description

                user.save
                    .then(() => {
                        res.status(200).send({message: "User was updated successfully"});
                    })
                    .catch(err => {
                        res.status(500).send({message: "Errors occur when updating user: " + err});
                        return;
                    })
            })
    },
    // Delete a user with the specified user ID in the request
    deleteOne: (req, res) => {
        console.log("Deleting one user")
        let id = req.params.id ? req.params.id : res.locals.id;

        User.deleteOne({id: id})
            .then(() => {
                res.status(200).send({message: "User was deleted successfully"});
            }).catch(err => {
                if(err.name === 'NotFound')
                    return res.status(404).send({message: "User not found with ID " + id});

                return res.status(500).send({message: "Errors occur when deleting user with ID " + id + ": " + err});
        });
    }
};

