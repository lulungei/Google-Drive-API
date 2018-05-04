let mongoose = require('mongoose');

//Users Schema
let detailSchema = mongoose.Schema({
  Name:{
    type: String,
    required: true
  },
  Owner:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  }

});

let Detail = module.exports = mongoose.model('Detail', detailSchema);
