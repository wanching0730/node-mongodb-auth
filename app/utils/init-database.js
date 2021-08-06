const dbConfig = require ("../config/db.config");
const db = require("../models");
const Role = db.role;
const ROLES = db.ROLES;
const logger = require("../utils/logger")(__filename);

module.exports = {
    initDatabase: () => {
        db.mongoose
            .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DATABASE}`, {
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
    }
}

// initialise types of roles in MongoDB collection
function initialiseRoles() {
    Role.collection.estimatedDocumentCount()
        .then(count => {
            if (count === 0) {
                for (const role of ROLES) {
                    new Role({name: role})
                        .save()
                        .then(() => logger.info(`Added ${role} to Role collection`));
                }
            }
        });
}
