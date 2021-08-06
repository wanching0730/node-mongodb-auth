/*
Unit Testing using Mocha and Chai which is test with local database.
For ideal case, there should be a Test database and a Test environment for testing purpose to prevent data crashing.
*/

const chai = require("chai");
const expect = chai.expect;

const db = require("../app/models");
const User = db.user;

const {initDatabase} = require("../app/utils/init-database");
const {findOne} = require("../app/services/user.service");

before(() => {
    initDatabase();
})

describe("User Controller", function() {
    describe("create", function() {
        it("Should retrieve a user with specific ID",  async function() {
            //expect("wc125").to.equal("wc121");
            const user = await findOne("wc125");
            expect(user.id).to.equal("wc125");
            expect(user.name).to.equal("cayenne");
            expect(user.address).to.equal("abc");
            expect(user.description).to.equal("abc");
            expect(user.dob).to.equal("07/30/1997");
        });
    });
});
