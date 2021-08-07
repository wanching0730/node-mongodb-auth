// for normal user routes
const getUser = require('./users/get-user');
const updateUser = require('./users/update-user');
const deleteUser = require('./users/delete-user');

// for authentication routes
const register = require('./auth/register');
const login = require('./auth/login');
const logout = require('./auth/logout');
const refreshToken = require('./auth/refreshToken');

// for admin routes
const adminGetUsers = require('./admin/get-user');
const adminGetAllUsers = require('./admin/get-all-users');
const adminUpdateUsers = require('./admin/update-user');
const adminDeleteUsers = require('./admin/delete-user');
const adminDeleteAllUsers = require('./admin/delete-all-users');

// for relationship mapping routes
const findFollowers = require('./follow/find-followers');
const findFollowing = require('./follow/find-following');
const findNearby = require('./follow/find-nearby-friends');
const createFollowing = require('./follow/create-following');

module.exports = {
    paths:{
        // normal user
        '/users':{
            ...getUser,
            ...updateUser,
            ...deleteUser
        },
        // authentication
        '/register':{
            ...register
        },
        '/login':{
            ...login
        },
        '/logout':{
            ...logout
        },
        '/refreshToken':{
            ...refreshToken
        },
        // admin
        '/admin/users':{
            ...adminGetAllUsers,
            ...adminDeleteAllUsers
        },
        '/admin/users/{id}':{
            ...adminGetUsers,
            ...adminUpdateUsers,
            ...adminDeleteUsers
        },
        // relationship mapping
        '/users/following':{
            ...createFollowing
        },
        '/users/following/{id}':{
            ...findFollowing
        },
        '/users/followers/{id}':{
            ...findFollowers
        },
        '/users/nearbyFriends':{
            ...findNearby
        }
    }
}
