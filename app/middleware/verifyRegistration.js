/*
1. Check duplications for username
2. Check if roles in request exists in our database or not
*/

const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

module.exports = {
    // check duplications for username
    verifyNewUser: (req, res, next) => {
        console.log("Verifying new user");

        // check duplicate username
        User.findOne({
            name: req.body.name
        }).exec(function (err, user) {
            if (err) {
                res.status(500).send({message: err});
                return;
            }

            if (user) {
                res.status(400).send({message: "Error: Username is already in used"});
                return;
            }

            next();
        });
    },
    // check if roles in request exists in our database or not
    verifyRoles: (req, res, next) => {
        console.log("Verifying new user's role");

        // compare the provided role with the roles in our database
        if (req.body.roles) {
            for (let i = 0; i < req.body.roles.length; i++) {
                if (!ROLES.includes(req.body.roles[i])) {
                    res.status(400).send({
                        message: `Error: Role ${req.body.roles[i]} does not exist`
                    });
                    return;
                }
            }
            next();
        }
        next();
    }
}
