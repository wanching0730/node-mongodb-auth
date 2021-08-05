/*
1. Authentication: Verify the token in HTTP header
*/

const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;

const CustomError = require("../utils/custom-error");
const config = require("../config/auth.config.js");

// Detect expired token
// const catchError = (err, res) => {
//     if (err instanceof TokenExpiredError) return res.status(401).send({ message: "Error: Access token was expired" });
//     return res.sendStatus(401).send({ message: "Error: Unauthorized" });
// }

module.exports = {
    verifyToken: (req, res, next) => {
        let token = req.headers["x-access-token"];

        if (!token) throw new CustomError(403, "Error: Token not found");

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) throw new CustomError(401, "Error: User is not authenticated");
            res.locals.id = decoded.id;
            res.locals.roles = decoded.roles
            next();
        });
    }
}

