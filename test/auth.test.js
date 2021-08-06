/*
Unit Testing for Auth repository.
Using Mocha and Chai with local Test database.
NODE_ENV is passed when running command 'npm run test'.
*/

const chai = require("chai");
const expect = chai.expect;

const db = require("../app/models");
const User = db.user;

const {initDatabase} = require("../app/utils/init-database");
const {register, login} = require("../app/services/auth.service");

before(async function() {
    await initDatabase();
});

describe("Auth Controller", function() {
    describe("Error response for Register actions", function() {
        it("Should not be able to register user with invalid roles",  async function() {
            try {
                const user = new User({
                    id: "test user id",
                    name: "test user name",
                    password: "12345",
                    dob: "07/30/1997",
                    address: "test user address",
                    description: "test user description"
                });

                await register(user, ["moderator"]);
            } catch(err) {
                expect(err.statusCode).to.equal(400);
                expect(err.message).to.equal("Error: Roles provided are invalid");
            }
        });

        it("Should not be able to register user without user ID",  async function() {
            try {
                const user = new User({
                    name: "test user name",
                    password: "12345",
                    dob: "07/30/1997",
                    address: "test user address",
                    description: "test user description"
                });

                await register(user, ["moderator"]);
            } catch(err) {
                expect(err.statusCode).to.equal(400);
                expect(err.message).to.equal("Error: User ID cannot be empty for registration");
            }
        });

        it("Should not be able to register user without user name",  async function() {
            try {
                const user = new User({
                    id: "test user id",
                    password: "12345",
                    dob: "07/30/1997",
                    address: "test user address",
                    description: "test user description"
                });

                await register(user, ["moderator"]);
            } catch(err) {
                expect(err.statusCode).to.equal(400);
                expect(err.message).to.equal("Error: User name cannot be empty for registration");
            }
        });
    });

    describe("Success response for Register actions", function() {
        it("Should be able to register user with valid input",  async function() {
            const user = new User({
                id: "test user id",
                name: "test user name",
                password: "12345",
                dob: "07/30/1997",
                address: "test user address",
                description: "test user description"
            });

            const response = await register(user, ["admin"]);
            expect(response.statusCode).to.equal(200);
            expect(response.message).to.equal("User was registered successfully");
        });
    });

    describe("Error response for Login actions", function() {
        it("Should not be able to let user login without ID",  async function() {
            try {
                const credential = {
                    id: null,
                    password: "12345"
                };

                await login(credential.id, credential.password);
            } catch(err) {
                expect(err.statusCode).to.equal(400);
                expect(err.message).to.equal("Error: User ID cannot be empty for authentication");
            }
        });

        it("Should not be able to let user login without password",  async function() {
            try {
                const credential = {
                    id: "test user id",
                    password: null
                };

                await login(credential.id, credential.password);
            } catch(err) {
                expect(err.statusCode).to.equal(400);
                expect(err.message).to.equal("Error: User password cannot be empty for authentication");
            }
        });

        it("Should not be able to let user login without correct user ID",  async function() {
            try {
                const credential = {
                    id: "wrong user id",
                    password: "12345"
                };

                await login(credential.id, credential.password);
            } catch(err) {
                expect(err.statusCode).to.equal(401);
                expect(err.message).to.equal("Error: Invalid user");
            }
        });

        it("Should not be able to let user login without password",  async function() {
            try {
                const credential = {
                    id: "test user id",
                    password: "1234567890"
                };

                await login(credential.id, credential.password);
            } catch(err) {
                expect(err.statusCode).to.equal(401);
                expect(err.message).to.equal("Error: Invalid password");
            }
        });
    });

    describe("Success response for Login actions", function() {
        it("Should be able to let user login with correct ID and password",  async function() {
            const credential = {
                id: "test user id",
                password: "12345"
            };

            const response = await login(credential.id, credential.password);
            expect(response.body.id).to.equal("test user id");
            expect(response.body.name).to.equal("test user name");
        });
    });
});
