const authentication = require("./authenticate");
const authorization = require("./authorize");
const verifyRegistration = require("./verifyRegistration");

module.exports = {
    authentication,
    authorization,
    verifyRegistration
};
