const mongoose = require('mongoose')
// const validator = require('validator')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
  /*
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
  */
  slackUserID: {
    type: String,
    required: true,
  },
  slackOrganizationID: {
    type: String,
    required: false,
  },
  slackWorkspaceID: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
})

userSchema.virtual('createdTasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'creatorId'
})

userSchema.virtual('assignedTasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'currentAssigneeId'
})

/*
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email: email})

  if(!user) {
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if(!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}
*/

userSchema.statics.findOrCreate = async function (params) {
  /* eslint-disable no-use-before-define */
  const user = await User.findOne(params);
  if(!user) {
    await User(params).save();
    return User.findOne(params);
  }
  /* eslint-enable no-use-before-define */

  return user
}

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

userSchema.methods.getAssignedTasks = async function (params = {}) {
  const user = this

  params.currentAssigneeId = user._id // eslint-disable-line no-param-reassign
  return Task.find(params)
}

/*
userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({ token: token })
  await user.save()

  return token
}
*/

// Hash the plain text password before saving
/*
userSchema.pre('save', async function(next) {
  const user = this

  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})
*/

// Delete user posts when user is removed
/*
userSchema.pre('remove', async function(next) {
  const user = this

  await Post.deleteMany({ owner: user._id })

  next()
})
*/

const User = mongoose.model('User', userSchema)

module.exports = User
