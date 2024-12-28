import { ITask } from '@/interface/task.interface'
import { Task } from '@/schemas/schemas'

export class TaskService {
  async createTasks(task: ITask, userId: number) {
    return await Task.create({ ...task, user: userId })
  }
  async getAll(userId: number) {
    return await Task.find({ user: userId })
  }
}
