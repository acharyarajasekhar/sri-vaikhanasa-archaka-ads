'use strict'

const helloWorld = require('./hello-world');
const getUser = require('./users/get-user');
const setUserClaims = require('./users/set-user-claims');
const deleteAllUsers = require('./users/clean-all-users');

module.exports = (app) => {
    app.get('/', helloWorld);
    app.get('/user', getUser);
    app.post('/user/claims', setUserClaims);
    app.delete('/user', deleteAllUsers);
}