module.exports = {
    // operation's method
    put: {
        tags: ["User CRUD operations for Admin"], // operation's tag
        description: "Update one user", // short desc
        operationId: "updateOneUser", // unique operation id
        parameters: [
            // expected params
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
        requestBody: {
            // expected request body
            content: {
                // content-type
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/UpdateUserInput", // update user input model
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
                            $ref: "#/components/schemas/SuccessResponse", // SuccessResponse model
                        },
                    },
                },
            },
            // error response code
            400: {
                description: "This means that client-side input fails validation", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/BadRequestError", // BadRequestError model
                        },
                    },
                },
            },
            404: {
                description: "This indicates that a resource is not found", // response desc.
                content: {
                    // content-type
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/NotFoundError", // BadRequestError model
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
