module.exports = {
    // operation's method
    post: {
        tags: ["Authentication"], // operation's tag
        description: "Refresh token", // short desc
        operationId: "refreshToken", // unique operation id
        parameters: [], // expected params
        requestBody: {
            // expected request body
            content: {
                // content-type
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/RefreshLoginInput", // LoginInput model
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
                            $ref: "#/components/schemas/TokenSuccessResponse", // SuccessResponse model
                        },
                    },
                },
            },
            // error response code
            401: {
                description: "This means the user isn’t authenticated", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UnauthenticatedError", // BadRequestError model
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
