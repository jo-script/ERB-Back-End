const mongoose = require('mongoose');

const MemoSchema = new mongoose.Schema({
  title: {
    type: String, 
    minlength: 3,
    required: true
  },
  sentFrom: {
    type: String, 
    minlength: 3,
    required: true
  },
  sentTo: {
    type: String, 
    required: true
  },
  action: {
    type: String, 
    required: true
  },
  paragraph: {
    type: String, 
    required: true
  },
  user:{
    type:mongoose.Schema.Types.ObjectId, 
    ref:"User", 
    required: true
  }
  
},);

module.exports = mongoose.model('Memo', MemoSchema);
