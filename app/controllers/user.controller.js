/*
CRUD for User collection
*/
const User = require('../models/user.model.js');
const validate = require("../utils/validate");

// Create and Save a new user
exports.createOne = (req, res) => {
    // Validate request before passing to database

    // check user ID
    if(!req.body.id) return res.status(400).send({message: "Error: User ID cannot be empty"});

    // check user name
    if(!req.body.name) return res.status(400).send({message: "Error: User name cannot be empty"});

    // check D.O.B format
    if(!validate.validateDOB) return res.status(400).send({message: "Error: Date of Birth should be in mm/dd/yyyy format"});

    const user = new User({
        id: req.body.id,
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 8),
        dob: req.body.dob,
        address: req.body.address,
        description: req.body.description
    });

    // save user's details
    user.save((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        // save user's roles by getting role_id from database
        if (req.body.roles) {
            // if user is admin
            Role.find(
                {
                    name: {$in: req.body.roles}
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({message: err});
                        return;
                    }

                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if (err) {
                            res.status(500).send({message: err});
                            return;
                        }

                        res.send({message: "User was registered successfully"});
                    });
                }
            );
        } else {
            // if user is normal user
            Role.findOne({name: "user"}, (err, role) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                }

                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        res.status(500).send({message: err});
                        return;
                    }

                    res.send({message: "User was registered successfully"});
                });
            });
        }
    });

};

// Retrieve and return all users
exports.findAll = (req, res) => {
    User.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some errors occurred when retrieving users"
        });
    });
};

// Find a single user with a user ID
exports.findOne = (req, res) => {
    let id = req.params.id ? req.params.id : req.locals.id;

    User.findById(id)
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with user ID " + id
                });
            }
            res.send(user);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with user ID " + id
            });
        }
        return res.status(500).send({
            message: "Error retrieving user with ID " + id
        });
    });
};

// Update a user identified by the user ID in the request
exports.updateOne = (req, res) => {
    let id = req.params.id ? req.params.id : req.locals.id;

    // check user ID
    if(!id) return res.status(400).send({message: "Error: User ID cannot be empty"});

    // check user name
    if(!req.body.name) return res.status(400).send({message: "Error: User name cannot be empty"});

    // check D.O.B format
    if(!validate.validateDOB) return res.status(400).send({message: "Error: Date of Birth should be in mm/dd/yyyy format"});

    User.findByIdAndUpdate(id, {
        id: id,
        name: req.body.name,
        dob: req.body.dob,
        address: req.body.address,
        description: req.body.description
    }, {new: true})
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with ID " + id
                });
            }
            res.send(user);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with ID " + id
            });
        }
        return res.status(500).send({
            message: "Error updating user with ID " + id
        });
    });
};

// Delete a user with the specified user ID in the request
exports.deleteOne = (req, res) => {
    let id = req.params.id ? req.params.id : req.locals.id;

    User.findByIdAndRemove(id)
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with ID " + id
                });
            }
            res.send({message: "User deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with ID " + id
            });
        }
        return res.status(500).send({
            message: "Could not delete user with ID " + id
        });
    });
};

