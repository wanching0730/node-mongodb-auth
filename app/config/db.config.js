require('dotenv').config();

// configure MongoDB
module.exports = {
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    DATABASE: process.env.NODE_ENV === "test" ? process.env.TEST_DB_NAME : process.env.DB_NAME,
    URI: process.env.DB_URI
};
