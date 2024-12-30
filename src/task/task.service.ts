import { ITask } from '@/interface/task.interface'
import { Task, Token } from '@/schemas/schemas'

export class TaskService {
  //async userIdentify(userId: string, refreshToken: string) {
  //  const findToken = await Token.findOne({ user: userId, refreshToken })
  //  console.log(findToken)
  //  if (findToken === null) {
  //    return false
  //  }
  //  return true
  //}
  async taskStatusChange(userId: string, taskId: string, status: boolean) {
    return await Task.updateOne(
      { _id: userId, task: taskId },
      { completed: status }
    )
  }
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

  async updateOne(userId: string, taskId: string, fields: {}) {
    return await Task.updateOne({ _id: taskId, user: userId }, fields)
  }
  async deleteOne(userId: string, taskId: string, field: {}) {
    return await Task.deleteOne({ _id: taskId, user: userId })
  }
}
