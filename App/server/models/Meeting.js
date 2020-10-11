const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    },
    audio: String,
    content: {
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    },
    numUsers:{
        type: Number
    },
    onGoing:{
        type: Boolean,
        default:true
    }
})

meetingSchema.index(
    {
      name: 'text',
      content: 'text',
    },
    {
      weights: {
        name: 5,
        content: 3,
      },
    }
  );



const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = { Meeting }