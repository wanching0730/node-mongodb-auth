const getUser = require('./users/get-user');
const updateUser = require('./users/update-user');
const deleteUser = require('./users/delete-user');

const adminGetUsers = require('./admin/get-user');
const adminGetAllUsers = require('./admin/get-all-users');
const adminUpdateUsers = require('./admin/update-user');
const adminDeleteUsers = require('./admin/delete-user');

module.exports = {
    paths:{
        '/admin/users':{
            ...adminGetAllUsers
        },
        '/admin/users/{id}':{
            ...adminGetUsers,
            ...adminUpdateUsers,
            ...adminDeleteUsers
        },
        '/users':{
            ...getUser,
            ...updateUser,
            ...deleteUser
        },

    }
}
