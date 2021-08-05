/*
1. Authorization: Check if user's role is the required roles or not
*/
const db = require("../models");
const User = db.user;
const Role = db.role;

isAdmin = (req, res, next) => {
    if(req.locals.role === "admin") {
        next();
        return;
    }
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        res.status(403).send({ message: "Error: Admin role is required" });
        return;
    });
};

const authorize = {
    isAdmin
};
module.exports = authorize;
