'use strict'

const admin = require('firebase-admin');

module.exports = (req, res, next) => {

    admin.auth().listUsers(1000)
        .then(function (listUsersResult) {
            listUsersResult.users.forEach(function (userRecord) {
                console.log('user', userRecord.toJSON());
                admin.auth().deleteUser(userRecord.uid)
                    .then(function () {
                        console.log('Successfully deleted user: ' + userRecord.uid);
                    })
                    .catch(function (error) {
                        console.log('Error deleting user:', error);
                    });
            });
            if (listUsersResult.pageToken) {
                // List next batch of users.
                res.json({ "message": "Call Again" })
            }
            else {
                res.json({ "message": "Done" })
            }
        })
        .catch(function (error) {
            console.log('Error listing users:', error);
            next(error);
        });

}