'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = require("./credentials/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
admin.firestore().settings({ timestampsInSnapshots: true });

const express = require('express');
const app = express();
require('./middlewares/').preHandlers(app);
require('./apis/')(app);
require('./middlewares/').postHandlers(app);

const trigger = require('./triggers/');

const api = functions.https.onRequest(app);

module.exports = { api, trigger };