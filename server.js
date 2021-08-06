const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const {options} = require("./docs/basicInfo");
const docs = require('./docs');

const CustomError = require("./app/utils/custom-error");
const logger = require("./app/utils/logger")(__filename);

const dbConfig = require ("./app/config/db.config");
const db = require("./app/models");
const Role = db.role;
const ROLES = db.ROLES;

const app = express();

let corsOptions = {
    origin: `http://localhost:${process.env.PORT}`
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
        logger.info("Successfully connected to MongoDB");
        initialiseRoles();
    })
    .catch(err => {
        logger.error("MongoDB connection error", err);
        process.exit();
    });

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// error handling
app.use((err, req, res, next) => {
    if (err instanceof CustomError) {
        // handle custom error message
        res.status(err.statusCode).json(err.message);
        logger.error(err.message)
    } else {
        // handle general error message thrown from database
        res.status(500).json(`Errors occur in database: ${err.message}`);
        logger.error(err) // log the full error message
    }
    return next();
})

// API documentation using Swagger
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(docs));
// const specs = swaggerJsdoc(options);
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}.`);
});

// initialise types of roles in MongoDB collection
function initialiseRoles() {
    Role.collection.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            for (const role of ROLES) {
                new Role({
                    name: role
                }).save();
                logger.info(`Added ${role} to Role collection`);
            }
        }
    });
}
