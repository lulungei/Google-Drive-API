
const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const hostname = '127.0.0.1'
const port = 3000;
// const readline = require('readline');
// const {google} = require('googleapis');
// const OAuth2Client = google.auth.OAuth2;
// const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
// const TOKEN_PATH = 'credentials.json';

mongoose.connect('mongodb://localhost', {
  db: 'drive',
  user: 'admin',
  pass: 'admin123'
});
let db = mongoose.connection;

//check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', function(err){
  console.log(err);
});
//Bring in models

let Detail = require('./models/details');

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Home route
app.get('/', function(req, res){
  Detail.find({}, [],function(err, details){
    if(err){
      console.log(err);
    } else{
      console.log(details);
      res.render('index', {
        title: 'Drive Details',
        details: details
      });
    }
  });
});
// start server
app.listen(3000, function(){
  console.log('Server started on port 3000...')
})
//
// // Load client secrets from a local file.
// fs.readFile('client_secret.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Drive API.
//   authorize(JSON.parse(content), listFiles);
// });
//
// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// function authorize(credentials, callback) {
//   const {client_secret, client_id, redirect_uris} = credentials.installed;
//   const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);
//
//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getAccessToken(oAuth2Client, callback);
//     oAuth2Client.setCredentials(JSON.parse(token));
//     callback(oAuth2Client);
//   });
// }
//
// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
//  */
// function getAccessToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return callback(err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// }
//
// /**
//  * Lists the names and IDs of up to 10 files.
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// function listFiles(auth) {
//   const drive = google.drive({version: 'v3', auth});
//   var fileId = "0B8ldcCcFo_M8TmI1Q3VaTnU2UHc";
// drive.files.list({
//     includeRemoved: false,
//     spaces: 'drive',
//     fileId: fileId,
//     fields: 'nextPageToken, files(id, name, parents, mimeType, modifiedTime, owners, viewedByMeTime, starred)',
//     q: `'${fileId}' in parents`
// },(err, {data}) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const files = data.files;
//     if (files.length) {
//       console.log('Files:');
//       files.map((file) => {
//         console.log(`${file.name} (${file.id}) ${file.mimeType} ${file.modifiedTime} ${file.parents} ${file.viewedByMeTime} ${file.starred}`);
//       });
//     } else {
//       console.log('No files found.');
//     }
//   });
// }
