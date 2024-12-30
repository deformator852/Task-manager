import { ITask } from '@/interface/task.interface'
import { Task } from '@/schemas/schemas'

export class TaskService {
  async taskStatusChange(userId: string, taskId: string, status: boolean) {
    return await Task.updateOne(
      { _id: userId, task: taskId },
      { completed: status }
    )
  }
  async createTasks(task: ITask, userId: string) {
    return await Task.create({ ...task, user: userId })
  }
  getAll(userId: string, completed: string | undefined) {
    return new Promise((resolve, reject) => {
      let query = { user: userId }
      if (completed) {
        Object.assign(query, completed === 'true' ? true : false)
      }
      const tasks = Task.find(query)
      if (!tasks) {
        reject(new Error("can't find task"))
      }
      resolve(tasks)
    })
  }

  getOne(userId: string, taskId: string) {
    return new Promise((resolve, reject) => {
      const task = Task.findOne({ _id: taskId, user: userId })
      if (!task) {
        reject(new Error('The such task no exist'))
      }
      resolve(task)
    })
  }

  async updateOne(userId: string, taskId: string, fields: {}) {
    return await Task.updateOne({ _id: taskId, user: userId }, fields)
  }
  async deleteOne(userId: string, taskId: string, field: {}) {
    return await Task.deleteOne({ _id: taskId, user: userId })
  }
}
