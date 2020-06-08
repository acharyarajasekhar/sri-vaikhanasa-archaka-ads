'use strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = functions.auth.user().onCreate(user => {

    var userProfile = {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        isActive: !user.disabled
    };
    
    return db.collection('users').doc(user.uid).set(userProfile);
    
});