module.exports = {
    // method of operation
    get: {
        tags: ["User's relationship mapping"], // operation's tag.
        description: "Get user's followers", // operation's desc.
        operationId: "getFollowers", // unique operation id.
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
                description: "Users can retrieve the list of followers by a specific ID", // response desc.
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
