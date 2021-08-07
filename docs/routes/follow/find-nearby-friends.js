module.exports = {
    // method of operation
    post: {
        tags: ["User's relationship mapping"], // operation's tag.
        description: "Get user's nearby following friends", // operation's desc.
        operationId: "getNearbyFriends", // unique operation id.
        parameters: [], // expected params.
        requestBody: {
            // expected request body
            content: {
                // content-type
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/FindNearbyFriendsInput", // update user input model
                    },
                },
            },
        },
        // expected responses
        responses: {
            // success response code
            200: {
                description: "Users can retrieve the list of nearby friends by own ID", // response desc.
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
