/*
1. Swagger UI is used to develop the API documentation
2. Components: Specify all the database models, user input, custom error response and success response
3. Tags: Categorise routes into different groups
4. Routes: All endpoints we have in our API
*/

const basicInfo = require('./basicInfo');
const components = require('./component');
const servers = require('./servers');
const tags = require('./tags');
const routes = require('./routes');

module.exports = {
    ...basicInfo,
    ...components,
    ...servers,
    ...tags,
    ...routes,
};
