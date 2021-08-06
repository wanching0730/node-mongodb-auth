/*
Unit Testing using chai, sinon, faker
1. Chai: Assertion methods such as expect(), assert(), should()
2. Sinon: Interact with other external methods such as stub in this case
3. Faker: Generate fake data
4. Mocha: Support async promise and hooks such as before, after, beforeEach, afterEach
*/

const axios = require('axios');
const chai = require("chai");
const sinon = require("sinon");
const faker = require("faker");
const expect = chai.expect;

const db = require("../app/models");
const User = db.user;

const {findOne} = require("../app/controllers/user.controller");

describe("User Controller", function() {
    const stubValue = {
        id: faker.random.uuid(),
        name: faker.name.findName(),
        address: faker.address.streetName(),
        description: faker.commerce.productDescription(),
        dob: faker.date.past(),
        createdAt: faker.date.past()
    };
    describe("create", function() {
        it("Should retrieve a user with specific ID", async function() {

            // const stub = sinon.stub(User, "findOne").returns(stubValue);
            // expect(stub.calledOnce).to.be.true;
            // expect(user.id).to.equal(stubValue.id);
            // expect(user.name).to.equal(stubValue.name);
            // expect(user.address).to.equal(stubValue.address);
            // expect(user.description).to.equal(stubValue.description);
            // expect(user.dob).to.equal(stubValue.dob);
            // expect(user.createdAt).to.equal(stubValue.createdAt);
        });
    });
});
