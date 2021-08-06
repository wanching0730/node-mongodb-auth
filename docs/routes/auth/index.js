const login = require('./login');
const register = require('./register');

module.exports = {
    paths:{
        '/register':{
            ...register
        },
        '/login':{
            ...login
        }
    }
}
