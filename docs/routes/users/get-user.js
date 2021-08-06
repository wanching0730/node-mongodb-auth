module.exports = {
    // method of operation
    get: {
        tags: ["User CRUD operations for Normal Users"], // operation's tag.
        description: "Get one user", // operation's desc.
        operationId: "getOneUser", // unique operation id.
        parameters: [], // expected params.
        // expected responses
        responses: {
            // success response code
            200: {
                description: "Normal users can retrieve their details by their own user ID", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/User", // User model
                        },
                    },
                },
            },
            // error response code
            404: {
                description: "This indicates that a resource is not found", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/NotFoundError", // NotFoundError model
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
