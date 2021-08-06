const getUser = require('./users/get-user');
const updateUser = require('./users/update-user');
const deleteUser = require('./users/delete-user');

const register = require('./auth/register');
const login = require('./auth/login');
const refreshToken = require('./auth/refreshToken');

const adminGetUsers = require('./admin/get-user');
const adminGetAllUsers = require('./admin/get-all-users');
const adminUpdateUsers = require('./admin/update-user');
const adminDeleteUsers = require('./admin/delete-user');
const adminDeleteAllUsers = require('./admin/delete-all-users');

module.exports = {
    paths:{
        '/users':{
            ...getUser,
            ...updateUser,
            ...deleteUser
        },
        '/register':{
            ...register
        },
        '/login':{
            ...login
        },
        '/refreshToken':{
            ...refreshToken
        },
        '/admin/users':{
            ...adminGetAllUsers,
            ...adminDeleteAllUsers
        },
        '/admin/users/{id}':{
            ...adminGetUsers,
            ...adminUpdateUsers,
            ...adminDeleteUsers
        }
    }
}
