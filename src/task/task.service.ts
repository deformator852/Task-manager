import { Task } from '@/schemas/schemas'
import { CreateTaskDTO, TaskResponseDTO } from '@/DTO/task.dto'
import mongoose from 'mongoose'

export class TaskService {
  async taskStatusChange(userId: string, taskId: string, status: boolean) {
    return await Task.updateOne(
      { _id: userId, task: taskId },
      { completed: status }
    )
  }
  async createTasks(task: CreateTaskDTO, userId: string) {
    return await Task.create({ ...task, user: userId })
  }
  getAll(
    userId: string,
    completed: string | undefined
  ): Promise<TaskResponseDTO[]> {
    return new Promise((resolve, reject) => {
      let query = { user: userId }
      if (completed !== undefined) {
        Object.assign(query, completed === 'true' ? true : false)
      }
      Task.find(query)
        .then((tasks) => {
          if (!tasks || tasks.length < 1) {
            reject(new Error("can't find tasks"))
          }
          resolve(<TaskResponseDTO[]>tasks)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  getOne(userId: string, taskId: string): Promise<TaskResponseDTO> {
    return new Promise((resolve, reject) => {
      const task = Task.findOne({ _id: taskId, user: userId })
      if (!task) {
        reject(new Error('The such task no exist'))
      }
      resolve(<TaskResponseDTO>task)
    })
  }

  async updateOne(userId: string, taskId: string, fields: {}) {
    return await Task.updateOne({ _id: taskId, user: userId }, fields)
  }
  async deleteOne(userId: string, taskId: string) {
    return await Task.deleteOne({
      _id: new mongoose.Types.ObjectId(taskId),
      user: userId,
    })
  }
}
