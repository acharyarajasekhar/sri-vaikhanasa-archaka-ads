const functions = require('firebase-functions');
const admin = require('firebase-admin');
const auth = admin.auth();

module.exports.newAdNotification = functions.firestore.document('archakaposts/{postId}')
    .onCreate((snap, context) => {

        let newData = snap.data();

        const payload = {
            notification: {
                title: 'New Archaka Ad...',
                body: `Temple Name: ${newData.name}, Salary: Rs.${newData.salary}/-`
            },
            data: {
                type: 'archakaad',
                id: newData.id,
                ownerId: newData.ownerId
            }
        };

        storeAsNotifications(payload);

        return admin.messaging().sendToTopic("userchannel", payload)
            .then(function (response) {
                console.log('Notification sent successfully:', response);
            })
            .catch(function (error) {
                console.log('Notification sent failed:', error);
            });

    });

module.exports.updatedAdNotification = functions.firestore.document('archakaposts/{postId}')
    .onUpdate((change, context) => {

        let newData = change.after.data();

        if (!!newData.isActive && !!newData.isVerified) {

            const payload = {
                notification: {
                    title: 'Updated Archaka Ad...',
                    body: `Temple Name: ${newData.name}, Salary: Rs.${newData.salary}/-`
                },
                data: {
                    type: 'archakaad',
                    id: newData.id,
                    ownerId: newData.ownerId
                }
            };

            storeAsNotifications(payload);

            return admin.messaging().sendToTopic("userchannel", payload)
                .then(function (response) {
                    console.log('Notification sent successfully:', response);
                })
                .catch(function (error) {
                    console.log('Notification sent failed:', error);
                });

        }

        return null;

    });

module.exports.reportAbuseNotification = functions.firestore.document('reportabuse/{id}')
    .onCreate((snap, context) => {

        let newData = snap.data();

        const payload = {
            notification: {
                title: `Report Abuse: ${newData.reportedInfo.type} (${newData.reportedInfo.isHidden})`,
                body: `${newData.reportedInfo.description} - ${newData.reportedBy.displayName}`
            },
            data: {
                type: 'report',
                id: newData.id
            }
        };

        return admin.messaging().sendToTopic("adminchannel", payload)
            .then(function (response) {
                console.log('Notification sent successfully:', response);
            })
            .catch(function (error) {
                console.log('Notification sent failed:', error);
            });

    });

module.exports.feedbackNotification = functions.firestore.document('feedbacks/{id}')
    .onCreate((snap, context) => {

        let newData = snap.data();

        const payload = {
            notification: {
                title: `Feedback: ${newData.feedbackInfo.type}`,
                body: `${newData.feedbackInfo.description} - ${newData.providedBy.displayName}`
            },
            data: {
                type: 'feedback',
                id: newData.id
            }
        };

        return admin.messaging().sendToTopic("adminchannel", payload)
            .then(function (response) {
                console.log('Notification sent successfully:', response);
            })
            .catch(function (error) {
                console.log('Notification sent failed:', error);
            });

    });

function storeAsNotifications(payload) {
    admin.firestore().collection('users').get().then((data) => {
        data.forEach((doc) => {
            if (doc.id !== payload.data.ownerId) {
                admin.firestore().collection('notifications').add({
                    userId: doc.id,
                    notification: payload,
                    dttm: admin.firestore.FieldValue.serverTimestamp(),
                    isNew: true
                });
            }
        });
    });
}
