const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const {CustomError} = require("./app/utils/error");

const dbConfig = require ("./app/config/db.config");
const db = require("./app/models");
const Role = db.role;
const ROLES = db.ROLES;

const app = express();

let corsOptions = {
    origin: "http://localhost:" + process.env.PORT
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// connect to MongoDB
db.mongoose
    .connect(`${dbConfig.URI}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connected to MongoDB.");
        initialiseRoles();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// error handling
app.use((err, req, res, next) => {
    if (err instanceof CustomError) res.status(err.statusCode).json(err.message);
    else res.status(500).json(err);

    return next();
})

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// initialise types of roles in MongoDB collection
function initialiseRoles() {
    Role.collection.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            for (const role of ROLES) {
                new Role({
                    name: role
                }).save(err => {
                    if (err) {
                        console.log("Error: ", err);
                    }

                    console.log(`Added ${role} to Role collection`);
                });
            }
        }
    });
}
