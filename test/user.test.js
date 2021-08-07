/*
Unit Testing for User repository.
Using Mocha and Chai with local Test database.
NODE_ENV is passed when running command 'npm run test'.
*/

const chai = require("chai");
const expect = chai.expect;

const db = require("../app/models");
const User = db.user;

const {findOne, findAll, updateOne, deleteOne, deleteAll} = require("../app/services/user.service");

describe("User Controller", function() {
    describe("Error response for Select, update, delete actions", function() {
        it("Should not be able to retrieve user details with wrong ID",  async function() {
            try {
                await findOne("wrong test user id");
            } catch(err) {
                expect(err.statusCode).to.equal(404);
                expect(err.message).to.equal("User not found with user ID: wrong test user id");
            }
        });

        it("Should not be able to update user details with wrong ID",  async function() {
            try {
                const user = new User({
                    name: "test user name",
                    dob: "07/30/1997",
                    address: "test user address",
                    description: "test user description"
                });

                await updateOne("wrong test user id", user);
            } catch(err) {
                expect(err.statusCode).to.equal(404);
                expect(err.message).to.equal("User not found with user ID: wrong test user id");
            }
        });

        it("Should not be able to delete user details with wrong ID",  async function() {
            try {
                await deleteOne("wrong test user id");
            } catch(err) {
                expect(err.statusCode).to.equal(404);
                expect(err.message).to.equal("User not found with user ID: wrong test user id");
            }
        });
    });

    describe("Success response for Select, update, delete actions", function() {

        it("Should be able to retrieve details of all users",  async function() {
            const users = await findAll();

            expect(users.length).to.equal(2);
        });

        it("Should be able to retrieve user details with correct ID",  async function() {
            const user = await findOne("test user id");

            expect(user.id).to.equal("test user id");
            expect(user.name).to.equal("test user name");
            expect(user.address).to.equal("test user address");
            expect(user.description).to.equal("test user description");
            expect(user.dob).to.equal("07/30/1997");
        });

        it("Should be able to update user details with correct ID",  async function() {
            const user = {
                name: "update user name",
                address: "update user address",
                description: "update user description"
            };

            await updateOne("test user id", user);
            let updatedUser = await findOne("test user id");

            expect(updatedUser.name).to.equal(user.name);
            expect(updatedUser.address).to.equal(user.address);
            expect(updatedUser.description).to.equal(user.description);
        });

        it("Should be able to delete user details with correct ID",  async function() {
            try {
                await deleteOne("test user id");
                await findOne("test user id");
            } catch(err) {
                expect(err.statusCode).to.equal(404);
                expect(err.message).to.equal("User not found with user ID: test user id");
            }
        });

        it("Should be able to delete all users",  async function() {
            await deleteAll();
            let response = await findAll();

            expect(response.length).to.equal(0);
        });
    })
});
