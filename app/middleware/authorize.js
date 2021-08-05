/*
1. Authorization: Check if user's role is the required roles or not
*/
const db = require("../models");
const User = db.user;
const Role = db.role;

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        Role.find(
            {
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                        next();
                        return;
                    }
                }

                res.status(403).send({ message: "Error: Admin role is required" });
                return;
            }
        );
    });
};

const authorize = {
    isAdmin
};
module.exports = authorize;
