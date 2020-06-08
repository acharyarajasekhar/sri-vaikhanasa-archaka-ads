const functions = require('firebase-functions');
const admin = require('firebase-admin');
const auth = admin.auth();

module.exports = functions.firestore.document('archakaposts/{postId}')
    .onCreate((snap, context) => {

        let newData = snap.data();

        const payload = {
            notification: {
                title: 'New Archaka Ad...',
                body: `Temple Name: ${newData.name} <br/> Salary: Rs.${newData.salary}/-`
            }
        };

        return admin.messaging().sendToTopic("newarchakaads", payload)
            .then(function (response) {
                console.log('Notification sent successfully:', response);
            })
            .catch(function (error) {
                console.log('Notification sent failed:', error);
            });

    });

module.exports = functions.firestore.document('archakaposts/{postId}')
    .onUpdate((change, context) => {

        let newData = change.after.data();

        const payload = {
            notification: {
                title: 'Updated Archaka Ad...',
                body: `Temple Name: ${newData.name} <br/> Salary: Rs.${newData.salary}/-`
            }
        };

        return admin.messaging().sendToTopic("newarchakaads", payload)
            .then(function (response) {
                console.log('Notification sent successfully:', response);
            })
            .catch(function (error) {
                console.log('Notification sent failed:', error);
            });

    });