import { ITask } from '@/interface/task.interface'
import { Task } from '@/schemas/schemas'

export class TaskService {
  async createTasks(task: ITask, userId: string) {
    return await Task.create({ ...task, user: userId })
  }
  async getAll(userId: string, completed: string | undefined) {
    let query = { user: userId }
    if (completed) {
      query.completed = completed === 'true' ? true : false
    }
    return await Task.find(query)
  }

  async getOne(userId: string, taskId: string) {
    return await Task.findOne({ _id: taskId, user: userId })
  }

  async updateOne(userId: string, taskId: string) {
    return await Task.updateOne({ _id: taskId, user: userId })
  }
  async deleteOne(userId: string, taskId: string) {
    return await Task.deleteOne({ _id: taskId, user: userId })
  }
}
