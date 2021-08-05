/*
A class to handle customize error messages for different error status code except status code 500
*/

class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        // this.message = message;
    }
}

module.exports = CustomError
