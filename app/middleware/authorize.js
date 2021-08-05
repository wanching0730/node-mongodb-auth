/*
1. Authorization: Check if user's role is the required roles or not
(In this case, it must be admin role)
*/
module.exports = {
    isAdmin: (req, res, next) => {
        if(res.locals.roles.find(r => r.name === "admin")) {
            next();
            return;
        }

        res.status(403).send({ message: "Error: Admin role is required" });
        return;
    }
};
