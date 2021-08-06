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
