const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


exports.TestFirebaseStorage = functions.https.onCall(function (data, context) {
    let RefRealTimeDatabase = admin.database().ref(data.FirebaseEnvironment + "/TestCloudFunctions/");
    let RefFirebaseStorage = admin.storage().ref(data.FirebaseEnvironment + "/TestFirebaseFunctions/");
    return RefFirebaseStorage.putString(data.text).then(
        function () {
            RefRealTimeDatabase.set("Ajouté depuis  firebase cloud functions");
            return null;
        }
    );
});