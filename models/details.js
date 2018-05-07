let mongoose = require('mongoose');

//Users Schema
let detailSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  owner:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  }

});

let Detail = module.exports = mongoose.model('Detail', detailSchema);
