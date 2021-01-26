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
  let after_encode = `${data.time}${data.senderId}.mp3`;
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

exports.DevEncodeMp3 = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket;
  const filePath = object.name;
  const contentType = object.contentType;
  const fileName = path.basename(filePath);

  if (filePath.startsWith('dev/')) {

    if (contentType.startsWith('audio/')) {

      if (!fileName.endsWith('.mp3')) {

        const bucket = gcs.bucket(fileBucket);
        const tempFilePath = path.join(os.tmpdir(), fileName);

        const targetTempFileName = fileName.replace(/\.[^/.]+$/, '') + object.metadata.senderId + '.mp3';
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
            "senderId": object.metadata.senderId, //sender firebase token
            "memberId": object.metadata.memberId, //reciever firebase token
            "memberLastOs": object.metadata.memberLastOs,
            "memberRegistrationId": object.metadata.memberRegistrationId,
            "memberprofilePic": object.metadata.memberprofilePic,
            "senderPrivateId": object.metadata.senderPrivateId,
            "senderFullName": object.metadata.senderFullName,
            "chatId": object.metadata.chatId,
            "message": object.metadata.message,
            "Environnement": object.metadata.Environnement,
            "seen_by": {
              [object.metadata.senderId]: true
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
      }
      return null;
    }
    return null;
  }
  return null;

});


function AddMessageToFirebase(dataMessage) {
  if (dataMessage.Environnement === "dev") {
    let ref = admin.database().ref(dataMessage.Environnement + '/messages/' + dataMessage.chatId);
    ref.push().set(dataMessage).then(() => {
      return GetMessageId(dataMessage);
    }).catch(err => {
      console.log(`Unable to Add message to Firebase ${err.message}`);
    });
  }

}

function GetMessageId(dataMessage) {
  let ref = admin.database().ref(dataMessage.Environnement + '/messages/' + dataMessage.chatId);
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
    ['/users/' + dataMessage.memberId + '/chats/' + [dataMessage.chatId] + "/time"]: dataMessage.time,
    ['/users/' + dataMessage.senderId + '/chats/' + [dataMessage.chatId] + "/time"]: dataMessage.time
  }).then(() => {
    // Create a notification
    let payload;
    let sender_info = {
      profil_pic: dataMessage.memberprofilePic,
      fullname: dataMessage.senderFullName,
      chatId: dataMessage.chatId
    };
    if (dataMessage.memberLastOs === "ios") {
      payload = {
        notification: {
          title: dataMessage.senderFullName,
          body: "A envoyé un message vocal",
          sound: "default"
        }, data: {
          "title": dataMessage.senderFullName,
          "body": "message vocal",
          "type": "send_message",
          "sender_info": JSON.stringify(sender_info),
          "force-start": "1",
          "content_available": "true",
          "priority": "high"
        }
      };
    }
    if (dataMessage.memberLastOs === "android") {
      payload = {
        data: {
          "title": dataMessage.senderFullName,
          "body": "A envoyé un message vocal",
          "type": "send_message",
          "sender_info": JSON.stringify(sender_info),
          "force-start": "1",
          "content_available": "true",
          "priority": "high"
        }
      };
    }

    //Create an options object that contains the time to live for the notification and the priority
    const options = {
      priority: "high",
      timeToLive: 60 * 60 * 24
    };

    return admin.messaging().sendToDevice(dataMessage.memberRegistrationId, payload, options);
  }).catch(err => {
    console.log(`Unable get message id from Firebase ${err.message}`);
  });
}
