let mongoose = require('mongoose');

//Details Schema
let detailSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
