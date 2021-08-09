/*
Database CRUD logic for User collection
*/

const db = require("../models");
const User = db.user;

const CustomError = require("../utils/custom-error");

module.exports = {
    // Retrieve and return all users
    findAll: async () => {
        const users = await User.find({}, { password: 0, refreshToken: 0 });
        return (users);
    },

    // Find a single user with a user ID
    findOne: async (id) => {
        const user = await User.findOne({id}, { password: 0, refreshToken: 0 })
            .populate("roles", "-__v");

        if (!user) throw new CustomError(404, `User not found with user ID: ${id}`)
        return (user);
    },

    // Update a user identified by the user ID in the request
    updateOne: async (id, body) => {
        let user = await User.findOne({id});

        if (!user) throw new CustomError(404, `User not found with user ID: ${id}`);

        await User.findOneAndUpdate({id}, body, {useFindAndModify: false});
    },

    // Delete a user with the specified user ID in the request
    deleteOne: async (id) => {
        try {
            await User.findOneAndDelete({id}, {useFindAndModify: false});
        } catch (err) {
            if (err.name === 'NotFound') throw new CustomError(404, `User not found with user ID: ${id}`);
        }
    },

    // Delete all users
    deleteAll: async (req, res) => {
        await User.deleteMany({});
    }
};

