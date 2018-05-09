const express = require('express');
const router = express.Router();


//Bring in models
let Detail = require('../models/details');


//add route
router.get('/add', function(req, res){
  res.render('enter_id', {
    title: 'New Folder'
  });
});

// Add submit POST route
router.post('/add', function(req, res){
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('owner', 'Owner is required').notEmpty();
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
    detail.owner = req.body.owner;
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

//Edit folder
router.get('/edit/:id', function(req, res){
  Detail.findById(req.params.id, function(err, details){
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
  let query = {_id:req.params.id}

  Detail.remove(query, function(err){
    if(err){
      console.log(err)
    } //test for the error
    res.send('Success'); //sends back response because request was made in main.js
  });
});

//Get single folder details
router.get('/:id', function(req, res){
  Detail.findById(req.params.id, function(err, details){
    console.log(details)
    res.render('detail', {
      details:details
    });
  })
})

module.exports = router;
