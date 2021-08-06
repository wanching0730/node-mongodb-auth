module.exports = {
    // method of operation
    get: {
        tags: ["User CRUD operations for Admin"], // operation's tag.
        description: "Get one user", // operation's desc.
        operationId: "getOneUser", // unique operation id.
        parameters: [
            // expected params.
            {
                name: "id", // name of the param
                in: "path", // location of the param
                schema: {
                    $ref: "#/components/schemas/id", // data model of the param
                },
                required: true, // Mandatory param
                description: "A single user ID", // param desc.
            },
        ],
        // expected responses
        responses: {
            // success response code
            200: {
                description: "Admin can retrieve any user details by the user ID", // response desc.
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
