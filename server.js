const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const swaggerUI = require("swagger-ui-express");
const docs = require('./docs');

const {initDatabase} = require("./app/utils/init-database");
const CustomError = require("./app/utils/custom-error");
const logger = require("./app/utils/logger")(__filename);

const app = express();

let corsOptions = {
    origin: `http://localhost:${process.env.PORT}`
};

app.use(cors(corsOptions));

app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    );
    next();
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// connect to MongoDB
initDatabase();

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

// set up Swagger for API documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}.`);
});


