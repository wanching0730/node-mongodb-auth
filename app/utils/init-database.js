const dbConfig = require ("../config/db.config");
const db = require("../models");
const Role = db.role;
const ROLES = db.ROLES;
const logger = require("../utils/logger")(__filename);

module.exports = {
    initDatabase: async () => {
        try {
            await db.mongoose
                .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DATABASE}`, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });

            logger.info(`Successfully connected to MongoDB: ${dbConfig.DATABASE}`);
            await initialiseRoles();
        } catch (err) {
            logger.error("MongoDB connection error", err);
            process.exit();
        }
    }
}

// initialise types of roles in MongoDB collection
async function initialiseRoles() {
    const count = await Role.collection.estimatedDocumentCount();
    if (count === 0) {
        for (const role of ROLES) {
            await new Role({name: role}).save();
            logger.info(`Added ${role} to Role collection`);
        }
    }
}
