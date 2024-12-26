import express from 'express'
import dotenv from 'dotenv'
import compression from 'compression'
import mongoose from 'mongoose'
import { tasksRouter } from '@/tasks/tasks.controller'
import { usersRouter } from '@/users/users.controller'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()
const app = express()
const PORT = process.env.PORT ?? 8080
const PREFIX = '/api'

async function main() {
  await connectDB()
  app.use(cors())
  app.use(express.json())
  app.use(cookieParser())
  app.use(compression({ threshold: 1024 }))
  app.use(PREFIX + '/tasks', tasksRouter)
  app.use(PREFIX + '/users', usersRouter)
  app.listen(PORT, () => {
    console.log(`[✓]PORT ${PORT}[✓]`)
  })
}

async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/taskManager')
    console.log('MongoDB connected!')
  } catch (error) {
    console.error('MongoDB connection error:', error)
  }
}
main()
