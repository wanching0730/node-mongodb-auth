require('dotenv').config()

// configure MongoDB
module.exports = {
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    DATABASE: process.env.DB_NAME,
    URI: process.env.DB_URI
};
