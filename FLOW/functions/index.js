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
  })
    .then(urls => {
      var url = urls[0];
      console.log(`Audio url = ${url}`);

      // UPDATE REALTIME DATABASE ICI ET NE PAS OUBLIER DE SET LE SEEN
      return url;
    })
    .catch(err => {
      console.log(`Unable to upload audio ${err.message}`);
    });

  fs.unlinkSync(tempFilePath);
  fs.unlinkSync(targetTempFilePath);
  return null;

  // Once the audio has been uploaded delete the local file to free up disk space.

});
