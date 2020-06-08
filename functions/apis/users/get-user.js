'use strict'

const admin = require('firebase-admin');

module.exports = (req, res) => {
    admin.auth().getUser(req.query.uid).then(user => {
        res.json(user);
    })
}