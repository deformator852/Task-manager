export interface CreateTaskDTO {
  name: string
  description?: string
  completed: boolean
  deadline: Date
  user: number
}

export interface TaskResponseDTO {
  name?: string
  description?: string
  completed?: boolean
  deadline?: Date
}

export interface TaskStatsDTO {
  completedTasks: number
  overdueTasks: number
  incompletedTasks: number
}
