/*
Unit Testing using Mocha and Chai which is test with local database.
For ideal case, there should be a Test database and a Test environment for testing purpose to prevent data crashing.
*/

const chai = require("chai");
const expect = chai.expect;

const db = require("../app/models");

const {initDatabase} = require("../app/utils/init-database");
const {findOne, findAll, updateOne, deleteOne, deleteAll} = require("../app/services/user.service");

before(function() {
    initDatabase();
});

describe("User Controller", function() {
    describe("Select, update, delete actions", function() {
        // with not found error
        it("Should not be able to retrieve user details with wrong ID",  async function() {
            try {
                const user = await findOne("wrong normal user id");
            } catch(err) {
                expect(response.statusCode).to.equal(404);
                expect(response.message).to.equal("User not found with user ID wrong test id");
            }
        });

        it("Should not be able to update user details with wrong ID",  async function() {
            try {
                const user = await updateOne("wrong normal user id");
            } catch(err) {
                expect(response.statusCode).to.equal(404);
                expect(response.message).to.equal("User not found with user ID wrong test id");
            }
        });

        it("Should not be able to delete user details with wrong ID",  async function() {
            try {
                const user = await deleteOne("wrong normal user id");
            } catch(err) {
                expect(response.statusCode).to.equal(404);
                expect(response.message).to.equal("User not found with user ID wrong test id");
            }
        });

        // with success response
        it("Should be able to retrieve details of all users",  async function() {
            const users = await findAll();

            expect(users.length).to.equal(2);
        });

        it("Should be able to retrieve user details with specified ID",  async function() {
            const user = await findOne("normal user id");

            expect(user.id).to.equal("normal user id");
            expect(user.name).to.equal("normal user name");
            expect(user.address).to.equal("normal user address");
            expect(user.description).to.equal("normal user description");
            expect(user.dob).to.equal("07/30/1997");
        });

        it("Should be able to update user details with specified ID",  async function() {
            const response = await updateOne("normal user id");

            expect(response.statusCode).to.equal(200);
            expect(response.message).to.equal("User was updated successfully");
        });

        it("Should be able to delete user details with specified ID",  async function() {
            const response = await deleteOne("normal user id");

            expect(response.statusCode).to.equal(200);
            expect(response.message).to.equal("User was deleted successfully");
        });

        it("Should be able to delete all users",  async function() {
            const response = await deleteAll();

            expect(response.statusCode).to.equal(200);
            expect(response.message).to.equal("All users were deleted successfully");
        });
    });
});
