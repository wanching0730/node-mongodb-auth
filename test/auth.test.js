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
const {findOne} = require("../app/services/user.service");

before(async function () {
    await initDatabase();
});

describe("Auth Controller", function () {
    describe("Error response for Register actions", function () {
        it("Should not be able to register user with invalid roles", async function () {
            try {
                const user = new User({
                    id: "test user id",
                    name: "test user name",
                    password: "test12345",
                    dob: "07/30/1997",
                    address: "test user address",
                    description: "test user description"
                });

                await register(user, ["moderator"]);
            } catch (err) {
                expect(err.statusCode).to.equal(400);
                expect(err.message).to.equal("Error: Roles provided are invalid");
            }
        });

        it("Should not be able to register user without user ID", async function () {
            try {
                const user = new User({
                    name: "test user name",
                    password: "test12345",
                    dob: "07/30/1997",
                    address: "test user address",
                    description: "test user description"
                });

                await register(user, ["admin"]);
            } catch (err) {
                expect(err.statusCode).to.equal(400);
                expect(err.message).to.equal("Error: User ID cannot be empty for registration");
            }
        });

        it("Should not be able to register user without user name", async function () {
            try {
                const user = new User({
                    id: "test user id",
                    password: "test12345",
                    dob: "07/30/1997",
                    address: "test user address",
                    description: "test user description"
                });

                await register(user, ["admin"]);
            } catch (err) {
                expect(err.statusCode).to.equal(400);
                expect(err.message).to.equal("Error: User name cannot be empty for registration");
            }
        });

        it("Should not be able to register user without correct alphanumeric password format", async function () {
            try {
                const user = new User({
                    id: "test user id",
                    name: "test user name",
                    password: "12345",
                    dob: "30/07/1997",
                    address: "test user address",
                    description: "test user description"
                });

                await register(user, ["admin"]);
            } catch (err) {
                expect(err.statusCode).to.equal(400);
                expect(err.message).to.equal("Error: Password should be in alphanumeric format");
            }
        });

        it("Should not be able to register user without correct D.O.B format", async function () {
            try {
                const user = new User({
                    id: "test user id",
                    name: "test user name",
                    password: "test12345",
                    dob: "30/07/1997",
                    address: "test user address",
                    description: "test user description"
                });

                await register(user, ["admin"]);
            } catch (err) {
                expect(err.statusCode).to.equal(400);
                expect(err.message).to.equal("Error: Date of Birth should be in mm/dd/yyyy format");
            }
        });
    });

    describe("Success response for Register actions", function () {
        it("Should be able to register user with valid input with roles", async function () {
            const user = new User({
                id: "test user id",
                name: "test user name",
                password: "test12345",
                dob: "07/30/1997",
                address: "test user address",
                description: "test user description"
            });

            await register(user, ["admin"]);
            let newUser = await findOne("test user id");

            expect(newUser.name).to.equal(user.name);
        });

        it("Should be able to register user with valid input without roles (as normal user)", async function () {
            const user = new User({
                id: "test normal user id",
                name: "test normal user name",
                password: "test12345",
                dob: "07/30/1997",
                address: "test normal user address",
                description: "test normal user description"
            });

            await register(user, null);
            let newUser = await findOne("test normal user id");

            expect(newUser.name).to.equal(user.name);
        });
    });

    describe("Error response for Login actions", function () {
        it("Should not be able to let user login without ID", async function () {
            try {
                const credential = {
                    id: null,
                    password: "test12345"
                };

                await login(credential.id, credential.password);
            } catch (err) {
                expect(err.statusCode).to.equal(400);
                expect(err.message).to.equal("Error: User ID cannot be empty for authentication");
            }
        });

        it("Should not be able to let user login without password", async function () {
            try {
                const credential = {
                    id: "test user id",
                    password: null
                };

                await login(credential.id, credential.password);
            } catch (err) {
                expect(err.statusCode).to.equal(400);
                expect(err.message).to.equal("Error: User password cannot be empty for authentication");
            }
        });

        it("Should not be able to let user login without correct user ID", async function () {
            try {
                const credential = {
                    id: "wrong user id",
                    password: "test12345"
                };

                await login(credential.id, credential.password);
            } catch (err) {
                expect(err.statusCode).to.equal(401);
                expect(err.message).to.equal("Error: Invalid user");
            }
        });

        it("Should not be able to let user login without password", async function () {
            try {
                const credential = {
                    id: "test user id",
                    password: "1234567890"
                };

                await login(credential.id, credential.password);
            } catch (err) {
                expect(err.statusCode).to.equal(401);
                expect(err.message).to.equal("Error: Invalid password");
            }
        });
    });

    describe("Success response for Login actions", function () {
        it("Should be able to let user login with correct ID and password", async function () {
            const credential = {
                id: "test user id",
                password: "test12345"
            };

            const response = await login(credential.id, credential.password);
            expect(response.body.id).to.equal("test user id");
            expect(response.body.name).to.equal("test user name");
        });
    });
});
