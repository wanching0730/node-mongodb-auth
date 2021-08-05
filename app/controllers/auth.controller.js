/*
1. Register: Save new user's details, save new user's role
2. Login: Check whether user exists in database, verify password, generate an access token and return to user
*/
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const controller = require("../controllers/user.controller");

exports.login = (req, res) => {
    // check whether user exists in database
    User.findOne({
        name: req.body.name
    })
    .populate("roles", "-__v")
    .exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!user) {
            return res.status(401).send({ message: "Error: User not found." });
        }

        // verify password
        let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid)
            return res.status(401).send({accessToken: null, message: "Error: Invalid password"});

        // generate new access token
        let token = jwt.sign({ id: user.id, role: user.role }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        let authorities = [];

        for (let i = 0; i < user.roles.length; i++) {
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
            id: user.user_id
            name: user.name,
            roles: authorities,
            accessToken: token
        });
    });
};


