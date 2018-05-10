const express = require('express');
const router = express.Router();
const {google} = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
const TOKEN_PATH = '../credentials.json';
const fs = require('fs');
const readline = require('readline');

//Detail model
let Detail = require('../models/details');
// User Model
let User = require('../models/user');


//add route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('enter_id', {
    title: 'New Folder'
  });
});

// Add submit POST route
router.post('/add', function(req, res){
  req.checkBody('name', 'Name is required').notEmpty();
  //req.checkBody('owner', 'Owner is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  //Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('enter_id',{
      title: 'Add Folder',
      errors:errors
    });
  } else{
    let detail = new Detail();
    detail.name = req.body.name;
    detail.owner = req.user._id;
    detail.body = req.body.body;

    detail.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Folder Added');
        res.redirect('/')
      }
    });

  }


});

//Load Edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Detail.findById(req.params.id, function(err, details){
    if(details.owner != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_details', {
      title: 'Edit folder',
      details:details
    });
  });
});

// Update submit POST
router.post('/edit/:id', function(req, res){
  let detail= {};
  detail.name = req.body.name;
  detail.owner = req.body.owner;
  detail.body = req.body.body;

  let query = {_id:req.params.id} // query for ensuring the id in the request is the folder being updated
  Detail.update(query, detail, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Folder edited')
      res.redirect('/')
    }
  });
});

//Delete Folder
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Detail.findById(req.params.id, function(err, details){
    if(details.owner != req.user._id){
      res.status(500).send();
    } else{
      Detail.remove(query, function(err){
        if(err){
          console.log(err)
        } //test for the error
        res.send('Success'); //sends back response because request was made in main.js
      });
    }
  });
});

//Get single folder details
// router.get('/:id', function(req, res){
//   Detail.findById(req.params.id, function(err, details){
//     User.findById(details.owner, function(err, user){
//       res.render('detail', {
//         details:details,
//         owner: user.name
//       });
//     });
//   });
// });

//Access control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else{
    req.flash('danger', 'Please Login');
    res.redirect('/users/login');
  }
}

// Load client secrets from a local file.
fs.readFile('client_secret.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), listFiles);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
 //Get single folder details

    function listFiles(auth) {
      router.get('/:id', function(req, res){
        Detail.findById(req.params.id, function(err, details){
          User.findById(details.owner, function(err, user){
            res.render('detail', {
              details:details,
              owner: user.name
            });
      const drive = google.drive({version: 'v3', auth});
      // console.console.log();
      var fileId = details.body;
    drive.files.list({
        includeRemoved: false,
        spaces: 'drive',
        fileId: fileId,
        fields: 'nextPageToken, files(id, webViewLink, name, parents, mimeType, modifiedTime, owners, viewedByMeTime, starred)',
        q: `'${fileId}' in parents`
    },(err, {data}) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = data.files;
        if (files.length) {
          console.log('Files:');
          files.map((file) => {
            const content=JSON.stringify(files, null, 2);// this is where you convert the details object to a valid JSON string
            fs.writeFileSync('${file.id}.json',content);//this is where the file details are written to a file

            console.log(`${file.name} (${file.id}) ${file.mimeType} ${file.modifiedTime} ${file.parents} ${file.viewedByMeTime} ${file.starred}`);
          });
        } else {
          console.log('No files found.');
        }
      });
    });
  });
  });
    }


module.exports = router;
