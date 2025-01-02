import { Task } from '@/schemas/schemas'
import { CreateTaskDTO, TaskResponseDTO, TaskStatsDTO } from '@/DTO/task.dto'
import mongoose from 'mongoose'

export class TaskService {
  async getTasksStats(userId: string): Promise<TaskStatsDTO> {
    const pipeline: any[] = [
      {
        $match: { user: new mongoose.Types.ObjectId(userId) },
      },
      {
        $facet: {
          completedTasks: [
            { $match: { completed: true } },
            { $count: 'completedTasks' },
          ],
          incompletedTasks: [
            { $match: { completed: false } },
            { $count: 'incompletedTasks' },
          ],
          overdueTasks: [
            {
              $match: {
                completed: false,
              },
            },
            { $count: 'overdueTasks' },
          ],
        },
      },
    ]
    const stats = await Task.aggregate(pipeline)
    const completedTasks = stats[0].completedTasks[0]
    const incompletedTasks = stats[0].completedTasks[0]
    const overdueTasks = stats[0].completedTasks[0]
    const result: TaskStatsDTO = {
      ...completedTasks,
      ...incompletedTasks,
      ...overdueTasks,
    }
    return result
  }
  async getCompletedTasks(userId: string): Promise<TaskResponseDTO[]> {
    const tasks = await Task.find(
      { user: userId, completed: true },
      { _id: 1, name: 1, deadline: 1 }
    )
    return <TaskResponseDTO[]>tasks
  }
  async getOverDueTasks(userId: string): Promise<TaskResponseDTO[]> {
    const tasks = await Task.find(
      { _id: userId, overdue: true },
      { _id: 1, name: 1, deadline: 1 }
    )
    return <TaskResponseDTO[]>tasks
  }
  async taskStatusChange(userId: string, taskId: string, status: boolean) {
    return await Task.updateOne(
      { _id: taskId, user: userId },
      { completed: status }
    )
  }
  async createTasks(task: CreateTaskDTO, userId: string) {
    return await Task.create({ ...task, user: userId })
  }
  async getAll(userId: string): Promise<TaskResponseDTO[]> {
    let query = { user: userId }
    const tasks = await Task.find(query, {
      _id: 1,
      name: 1,
      deadline: 1,
      completed: 1,
    })
    return <TaskResponseDTO[]>tasks
  }

  async getOne(userId: string, taskId: string): Promise<TaskResponseDTO> {
    const task = await Task.findOne({ _id: taskId, user: userId })
    return <TaskResponseDTO>task
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
