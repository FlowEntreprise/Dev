/*jslint node: true */
/* jshint esversion: 8 */
'use strict';

const functions = require('firebase-functions');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const os = require('os');
const fs = require('fs');

const gcs = new Storage();

const admin = require('firebase-admin');
admin.initializeApp();

// Makes an ffmpeg command return a promise.
function promisifyCommand(command) {
  return new Promise((resolve, reject) => {
    command.on('end', resolve).on('error', reject).run();
  });
}

/**
 * When an audio is uploaded in the Storage bucket We generate a mono channel audio automatically using
 * node-fluent-ffmpeg.
 */

/*exports.UploadVoiceNote = functions.https.onCall(async (data, context) => {

  const uuidv1 = require('uuid/v1');
  console.log('Saving audio to GCS.');
  var bucket = admin.storage().bucket('flow-85249.appspot.com');
  var uuid = uuidv1();
  let before_encode = `${data.time}.wav`;
  let after_encode = `${data.time}${data.sender_id}.mp3`;
  const tempFilePath = path.join(os.tmpdir(), before_encode);
  const targetTempFilePath = path.join(os.tmpdir(), after_encode);
  const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
  const ffmpeg = require('fluent-ffmpeg');

  var command = ffmpeg(data.sound)
    .setFfmpegPath(ffmpegPath)
    .toFormat('mp3')
    .save(targetTempFilePath);

  await promisifyCommand(command);
  await bucket.upload(targetTempFilePath, { destination: after_encode }).then(stuff => {
    console.log("MP3 succesfully uploaded with await");//
    let file = bucket.file(after_encode);
    return file.getSignedUrl({
      action: 'read',
      expires: '03-09-2500'
    });
  })
    .then(urls => {
      var url = urls[0];
      console.log(`Audio url = ${url}`);
      return url;
    })
    .catch(err => {
      console.log(`Unable to upload audio ${err.message}`);
    });

});*/

// CE CODE FONCTIONNE PARFAITEMENT

exports.EncodeMp3 = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket;
  const filePath = object.name;
  const contentType = object.contentType;
  const fileName = path.basename(filePath);
  console.log(`le sender_id est : ${object.metadata.sender_id}`);

  if (!contentType.startsWith('audio/')) {
    console.log('This is not an audio.');
    return null;
  }


  if (fileName.endsWith('.mp3')) {
    console.log('Already a converted audio.');
    return null;
  }


  const bucket = gcs.bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);

  const targetTempFileName = fileName.replace(/\.[^/.]+$/, '') + object.metadata.sender_id + '.mp3';
  const targetTempFilePath = path.join(os.tmpdir(), targetTempFileName);
  const targetStorageFilePath = path.join(path.dirname(filePath), targetTempFileName);

  await bucket.file(filePath).download({ destination: tempFilePath });
  console.log('Audio downloaded locally to', tempFilePath);

  const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
  const ffmpeg = require('fluent-ffmpeg');
  let command = ffmpeg(tempFilePath)
    .setFfmpegPath(ffmpegPath)
    .toFormat('mp3')

    .save(targetTempFilePath);


  await promisifyCommand(command);
  console.log('Output audio created at', targetTempFilePath);



  console.log("delete wave file");
  await bucket.file(filePath).delete();
  // Uploading the audio.
  await bucket.upload(targetTempFilePath, { destination: targetStorageFilePath }).then(stuff => {
    console.log('Audio saved successfully.');
    //bucket.upload(targetTempFilePath);
    let file = bucket.file(targetStorageFilePath);
    return file.getSignedUrl({
      action: 'read',
      expires: '03-09-2500'
    });
  }).then(urls => {
    var url = urls[0];
    console.log(`Audio url = ${url}`);
    // UPDATE REALTIME DATABASE ICI ET NE PAS OUBLIER DE SET LE SEEN
    let dataMessage = {
      "sender_id": object.metadata.sender_id, //sender firebase token
      "member_id": object.metadata.member_id, //reciever firebase token
      "sender_private_id": object.metadata.sender_private_id,
      "sender_full_name": object.metadata.sender_full_name,
      "message": object.metadata.message,
      "Environnement": object.metadata.Environnement,
      "seen_by": {
        [object.metadata.sender_id]: true
      },
      "image": object.metadata.image,
      "audio": url,
      "time": Date.now()
    };
    return AddMessageToFirebase(dataMessage);
  }).catch(err => {
    console.log(`Unable to upload audio ${err.message}`);
  });

  fs.unlinkSync(tempFilePath);
  fs.unlinkSync(targetTempFilePath);
  return null;

  // Once the audio has been uploaded delete the local file to free up disk space.

});


function AddMessageToFirebase(dataMessage) {
  let ref = admin.database().ref(dataMessage.Environnement + '/messages/' + dataMessage.chat_id);
  ref.push().set(dataMessage).then(() => {
    return GetMessageId(dataMessage);
  }).catch(err => {
    console.log(`Unable to Add message to Firebase ${err.message}`);
  });
}

function GetMessageId(dataMessage) {
  let ref = admin.database().ref(dataMessage.Environnement + '/messages/' + dataMessage.chat_id);
  ref.once('value').then((snapshot) => {
    //console.log(snapshot);
    dataMessage.message_id = Object.keys(snapshot.val())[0];
    return updateMessage(dataMessage);

  }).catch(err => {
    console.log(`Unable get message id from Firebase ${err.message}`);
  });
}

function updateMessage(dataMessage) {
  admin.database().ref(dataMessage.Environnement + '/chats/' + dataMessage.message_id + "/last_message/").update(dataMessage).then(() => {
    return UpdateLastMessage(dataMessage);
  }).catch(err => {
    console.log(`Unable to update message in Firebase ${err.message}`);
  });
}

function UpdateLastMessage(dataMessage) {
  admin.database().ref(dataMessage.Environment).update({
    ['/users/' + dataMessage.member_id + '/chats/' + [dataMessage.chat_id] + "/time"]: dataMessage.time,
    ['/users/' + dataMessage.sender_id + '/chats/' + [dataMessage.chat_id] + "/time"]: dataMessage.time
  }).then(() => {
    // Create a notification
    const payload = {
      notification: {
        title: "NOTIF DEPUIS CLOUD FUNCTIONS",
        body: "challa ça marche",
        sound: "default"
      }
    };

    //Create an options object that contains the time to live for the notification and the priority
    const options = {
      priority: "high",
      timeToLive: 60 * 60 * 24
    };
    let instanceId = "fsvyLTIWBkw:APA91bGc1obfBYISqm7fiysz2Pyw3OEnpxb78JxwJW3AqIr7jVWv9nKUNWFOz2bynQ7RE5GfwCH7XRKQPlvdIjAigHirhg9wA6MmBSiYCTWhzdVXCiqXCkGBlRY8h3u6gWuYHjGXmOMR";
    return admin.messaging().sendToDevice(instanceId, payload, options);
  }).catch(err => {
    console.log(`Unable get message id from Firebase ${err.message}`);
  });
}
