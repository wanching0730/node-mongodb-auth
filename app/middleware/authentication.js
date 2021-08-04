/*
1. Authentication: Verify the token in HTTP header
*/

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "Error: Token not found" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Error: User is not authenticated" });
        }
        req.userId = decoded.id;
        next();
    });
};

const authentication = {
    verifyToken
};
module.exports = authentication;

