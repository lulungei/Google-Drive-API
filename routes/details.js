const express = require('express');
const router = express.Router();


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
router.get('/:id', function(req, res){
  Detail.findById(req.params.id, function(err, details){
    User.findById(details.owner, function(err, user){
      res.render('detail', {
        details:details,
        owner: user.name
      });
    });
  });
});

//Access control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else{
    req.flash('danger', 'Please Login');
    res.redirect('/users/login');
  }
}

module.exports = router;
