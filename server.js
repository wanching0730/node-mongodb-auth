const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require('dotenv').config()

const app = express();

var corsOptions = {
    origin: "http://localhost:" + process.env.PORT
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to ryde tech assessment." });
});

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
