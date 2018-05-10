let mongoose = require('mongoose');

//Details Schema
let detailSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  owner:{
    type: String,
    required: true
  },
  folderId:{
    type: String,
    required: true
  },
  files:{
    type: Array,
    default: []
  }

});

let Detail = module.exports = mongoose.model('Detail', detailSchema);
