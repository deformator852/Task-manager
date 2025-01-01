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
