module.exports = {
    // method of operation
    post: {
        tags: ["User's relationship mapping"], // operation's tag.
        description: "Create user's following list", // operation's desc.
        operationId: "createFollowing", // unique operation id.
        parameters: [], // expected params.
        requestBody: {
            // expected request body
            content: {
                // content-type
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/CreateFollowingInput", // update user input model
                    },
                },
            },
        },
        // expected responses
        responses: {
            // success response code
            200: {
                description: "This means that server successfully processed the request", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/SuccessResponse", // User model
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
