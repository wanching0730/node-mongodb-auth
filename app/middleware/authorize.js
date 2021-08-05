/*
1. Authorization: Check if user's role is the required roles or not
(In this case, it must be admin role)
*/
module.exports = {
    isAdmin: (req, res, next) => {
        console.log(res.locals.roles)
        if(res.locals.roles.includes("admin")) {
            next();
            return;
        }

        res.status(403).send({ message: "Error: Admin role is required" });
        return;
    }
};
