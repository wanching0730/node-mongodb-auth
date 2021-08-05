class CustomError extends Error {
    constructor(statusCode, message) {
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = CustomError
