module.exports = {
    // operation's method
    delete: {
        tags: ["User CRUD operations for Admin"], // operation's tag
        description: "Delete all users", // short desc
        operationId: "deleteOneUsers", // unique operation id
        parameters: [], // expected params
        // expected responses
        responses: {
            // success response code
            200: {
                description: "This means that server successfully processed the request", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/SuccessResponse", // SuccessResponse model
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
