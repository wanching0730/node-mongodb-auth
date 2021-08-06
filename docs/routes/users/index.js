const getUser = require('./get-user');
const updateUser = require('./update-user');
const deleteUser = require('./delete-user');

module.exports = {
    paths:{
        '/users':{
            ...getUser,
            ...updateUser,
            ...deleteUser
        }
    }
}
