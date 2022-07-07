const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  /*
  description: {
    type: String,
    required: true,
    trim: true
  },
  */
  status : {
    type: String,
    enum: ['OPEN', 'CLOSED'],
    default: 'OPEN',
  },
  dueDate : {
    type: Date,
    required: false,
  },
  scheduledMessageId: {
    type: String,
    required: false,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  currentAssigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  /*
  comments: [{
    comment: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    is_censored : {
      type: Boolean,
      default: false
    },
    createdAt : {
      type: Date,
      default: Date.now
    }
  }]
  */
}, {
  timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
