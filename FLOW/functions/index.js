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

exports.UploadVoiceNote = functions.https.onCall(async (data, context) => {

  const uuidv1 = require('uuid/v1');
  console.log('Saving audio to GCS.');
  var bucket = admin.storage().bucket('flow-85249.appspot.com');
  /*const options = {
    metadata: {
      contentType: 'audio/wav',
    }
  };*/
  var uuid = uuidv1();
  let after_encode;
  const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
  const ffmpeg = require('fluent-ffmpeg');
  /*let command = ffmpeg(data.sound)
    .setFfmpegPath(ffmpegPath)
    .toFormat('mp3')
  /*.on('end', () => {
    console.log("MP3 succesfully created with ffmpeg");
    await bucket.upload(targetTempFilePath, { destination: targetStorageFilePath });
  })//
  .save(data.sound);
//.output(targetTempFilePath);//

await promisifyCommand(command);*/

  var file = bucket.file(`audio/${uuid}_${data.time}.wav`);
  await file.save(data.sound)
    .then(stuff => {
      console.log('Audio saved successfully.');
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
      console.log(`Unable to upload audio ${err}`);
    });

});


/*exports.generateMonoAudio = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.

  // Exit if this is triggered on a file that is not an audio.
  if (!contentType.startsWith('audio/')) {
    console.log('This is not an audio.');
    return null;
  }

  // Get the file name.
  const fileName = path.basename(filePath);
  // Exit if the audio is already converted.
  if (fileName.endsWith('_output.mp3')) {
    console.log('Already a converted audio.');
    return null;
  }

  // Download file from bucket.
  const bucket = gcs.bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  // We add a '_output.flac' suffix to target audio file name. That's where we'll upload the converted audio.
  const targetTempFileName = fileName.replace(/\.[^/.]+$/, '') + '_output.mp3';
  const targetTempFilePath = path.join(os.tmpdir(), targetTempFileName);
  const targetStorageFilePath = path.join(path.dirname(filePath), targetTempFileName);

  await bucket.file(filePath).download({ destination: tempFilePath });
  console.log('Audio downloaded locally to', tempFilePath);
  // Convert the audio to mono channel using FFMPEG.
  const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
  const ffmpeg = require('fluent-ffmpeg');
  let command = ffmpeg(tempFilePath)
    //.setFfmpegPath(ffmpegPath)
    .toFormat('mp3')
    /*.on('end', () => {
      console.log("MP3 succesfully created with ffmpeg");
      await bucket.upload(targetTempFilePath, { destination: targetStorageFilePath });
    })//
    .save(targetTempFilePath);
  /*.output(targetTempFilePath);//

  await promisifyCommand(command);
  console.log('Output audio created at', targetTempFilePath);
  // Uploading the audio.
  await bucket.upload(targetTempFilePath, { destination: targetStorageFilePath });
  console.log('Output audio uploaded to', targetStorageFilePath);

  // Once the audio has been uploaded delete the local file to free up disk space.
  fs.unlinkSync(tempFilePath);
  fs.unlinkSync(targetTempFilePath);

  return console.log('Temporary files removed.', targetTempFilePath);
});*/
