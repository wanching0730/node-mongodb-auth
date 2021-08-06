const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./component');
const tags = require('./tags');
const todos = require('./users');

module.exports = {
    ...basicInfo,
    ...servers,
    ...components,
    ...tags,
    ...todos
};
