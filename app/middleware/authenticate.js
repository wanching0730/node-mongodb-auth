/*
Authentication
1. Verify the token in HTTP header
2. Generate new access token and refresh token
*/

const jwt = require("jsonwebtoken");
const { TokenExpiredError, JsonWebTokenError } = jwt;

const CustomError = require("../utils/custom-error");
const logger = require("../utils/logger")(__filename);

const {findOne, updateOne} = require("../services/user.service");
const {secret, jwtExpiration, jwtRefreshExpiration} = require("../config/auth.config");

module.exports = {
    verifyToken: (req, res, next) => {
        let token = req.headers["x-access-token"];

        if (!token) throw new CustomError(403, "Error: Token not found");

        jwt.verify(token, secret, (err, decoded) => {
            if (err) throw new CustomError(401, "Error: User is not logged in");
            res.locals.id = decoded.id;
            res.locals.roles = decoded.roles
            next();
        });
    },
    refreshToken: (req, res, next) => {
        return jwt.verify(req.body.refreshToken, secret, async (err, decoded) => {
            if (err instanceof TokenExpiredError) throw new CustomError(401, "Error: Refresh token was expired");
            if (err instanceof JsonWebTokenError) throw new CustomError(401, "Error: Invalid refresh token");

            const {id, roles, refreshToken} = await findOne(decoded.id);

            if(refreshToken !== req.body.refreshToken)
                throw new CustomError(401, "Error: User's refresh token not matched with database");

            // generate new access token with user's ID and user's roles
            const newToken = jwt.sign({ id: id, roles: roles.map(r => r.name) }, secret, {
                expiresIn: jwtExpiration
            });

            // generate new refresh token with user's ID
            const newRefreshToken = jwt.sign({ id: id }, secret, {
                expiresIn: jwtRefreshExpiration
            });

            logger.audit(`New access token and refresh token are generated successfully`);

            await updateOne(id, {refreshToken: newRefreshToken});
            logger.audit(`New refresh token is updated to database successfully`);

            res.status(200).send({accessToken: newToken, refreshToken: newRefreshToken});
        });
    }
}

