/*
Database CRUD logic for User collection
*/

const db = require("../models");
const User = db.user;

const CustomError = require("../utils/custom-error");

module.exports = {
    // Retrieve and return all users
    findAll: () => {
        return User.find()
            .then(users => {
                return(users);
            });
    },

    // Find a single user with a user ID
    findOne: (id) => {
        return User.findOne({id: id})
            .populate("roles", "-__v")
            .then(user => {
                if(!user) throw new CustomError(404, `User not found with user ID: ${id}`)
                return(user);
            });
    },

    // Update a user identified by the user ID in the request
    updateOne: (id, body) => {
        return User.findOne({id: id})
            .then(user => {
                if(!user) throw new CustomError(404, `User not found with user ID: ${id}`);

                const {name, dob, address, description} = body;
                user.name = name;
                user.dob = dob;
                user.address = address;
                user.description = description;

                return user.save()
                    .then(() => {
                        return({statusCode: 200, message: "User was updated successfully"});
                    });
            });
    },

    // Delete a user with the specified user ID in the request
    deleteOne: (id) => {
        return User.deleteOne({id: id})
            .then(() => {
                return({statusCode: 200, message: "User was deleted successfully"});
            }).catch(err => {
            if(err.name === 'NotFound') throw new CustomError(404, `User not found with user ID: ${id}`);
        });
    },

    // Delete all users
    deleteAll: (req, res) => {
        return User.deleteMany({})
            .then(() => {
                return({statusCode: 200, message: "All users were deleted successfully"});
            })
    }
};

