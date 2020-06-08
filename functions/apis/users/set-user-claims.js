'use strict'

const admin = require('firebase-admin');

module.exports = (req, res, next) => {

    admin.auth().setCustomUserClaims(req.query.uid, req.body).then(() => {
        res.json({ "message": "Done" });
    }).catch(err => next(err));

}