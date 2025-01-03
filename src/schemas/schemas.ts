import mongoose, { mongo, Schema } from 'mongoose'

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
  overdue: {
    type: Boolean,
    default: false,
  },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
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
  activationLink: {
    type: String,
    required: true,
  },
})

const TokenSchema = new Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
})

export const Token = mongoose.model('Token', TokenSchema)
export const Task = mongoose.model('Task', TaskSchema)
export const User = mongoose.model('User', UserSchema)
