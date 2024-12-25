import mongoose, { mongo } from 'mongoose'

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 255,
  },
  description: {
    type: String,
    maxLength: 800,
  },
  deadline: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  user: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
})

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxLength: 100,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    maxLength: 255,
  },
  isEmailVerify: {
    type: Boolean,
    required: true,
    default: false,
  },
})

export const Task = mongoose.model('Task', TaskSchema)
export const User = mongoose.model('User', UserSchema)
