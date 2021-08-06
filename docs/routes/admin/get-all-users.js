module.exports = {
    // method of operation
    get: {
        tags: ["User CRUD operations for Admin"], // operation's tag.
        description: "Get all users", // operation's desc.
        operationId: "getOneUsers", // unique operation id.
        // expected responses
        responses: {
            // success response code
            200: {
                description: "Admin can retrieve all user details", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/User", // User model
                        },
                    },
                },
            },
            500: {
                description: "This is a generic server error", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/InternalServerError", // InternalServerError model
                        },
                    },
                },
            },
        },
    },
};
