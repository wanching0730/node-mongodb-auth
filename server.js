const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// database configuration
const dbConfig = require ("./config/db.config");
const db = require("./app/models");
const Role = db.role;
const ROLES = db.ROLES;

require('dotenv').config()

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
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connected to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to ryde tech assessment." });
});

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// initialise types of roles in MongoDB collection
function initialiseRoles() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            for(const role of Role) {
                new Role({
                    name: role
                }).save(err => {
                    if (err) {
                        console.log("Error: ", err);
                    }

                    console.log(`Added ${role} to roles collection`);
                });
            }
        }
    });
