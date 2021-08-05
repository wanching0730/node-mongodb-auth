/*
A function to handle catch errors at every route, don't need to do it individually in every route
*/

const asyncHandler = fn => (...args) => {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch(next);
}

module.exports.asyncHandler = asyncHandler
