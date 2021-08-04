const authentication = require("./authentication");
const authorization = require("./authorization");
const verifyRegistration = require("./verifyRegistration");

module.exports = {
    authenticatorSelection,
    authorization,
    verifyRegistration
};
