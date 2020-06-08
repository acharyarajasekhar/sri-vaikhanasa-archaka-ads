'use strict'

const cookieParser = require('cookie-parser')();
const cors = require('cors')({
    origin: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
    methods: ['OPTIONS', 'GET', 'PUT', 'POST', 'DELETE'],
    'preflightContinue': false
});
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');
const errorhandler = require('errorhandler')

module.exports.preHandlers = (app) => {
    app.use(cors);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser);
    app.use(timeout('30s'));
}

module.exports.postHandlers = (app) => {
    app.use(errorhandler());
}