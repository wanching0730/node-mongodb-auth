const getUser = require('./get-user');
const getAllUsers = require('./get-all-users');
const updateUser = require('./update-user');
const deleteUser = require('./delete-user');

module.exports = {
    paths:{
        '/admin/users/{id}':{
            ...getUser,
            ...updateUser,
            ...deleteUser
        },
        '/admin/users':{
            ...getAllUsers
        }
    }
}
