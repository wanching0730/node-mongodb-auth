/*
1. Authorization: Check if user's role is the required roles or not
(In this case, it must be admin role)
*/
isAdmin = (req, res, next) => {
    if(req.locals.role === "admin") {
        next();
        return;
    }

    res.status(403).send({ message: "Error: Admin role is required" });
    return;
};

const authorize = {
    isAdmin
};
module.exports = authorize;
