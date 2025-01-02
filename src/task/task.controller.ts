import { Response, Router } from 'express'
import { TaskService } from './task.service'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '@/utilities/utilities.responses'
import { AuthRequest } from '@/interface/request.interface'
import { CreateTaskDTO, TaskStatsDTO } from '@/DTO/task.dto'

export const router = Router()
const service = new TaskService()

router.get('/stats', async (req: AuthRequest, res: Response) => {
  const userId = <string>req.userId
  try {
    const result: TaskStatsDTO = await service.getTasksStats(userId)
    sendSuccessResponse(result, res)
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})
router.get('/completed', async (req: AuthRequest, res: Response) => {
  const userId = <string>req.userId
  try {
    const tasks = await service.getCompletedTasks(userId)
    sendSuccessResponse(tasks, res)
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})
router.get('/overdue', async (req: AuthRequest, res: Response) => {
  const userId = <string>req.userId
  try {
    await service.getOverDueTasks(userId)
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})

router.patch(
  '/:task_id/incomplete/',
  async (req: AuthRequest, res: Response) => {
    try {
      const taskId = <string>req.params.task_id
      const userId = <string>req.userId
      const result = await service.taskStatusChange(userId, taskId, fals)
      if (result.modifiedCount == 0) {
        return sendErrorResponse("can't update task", res)
      }
      sendSuccessResponse({ message: 'success' }, res)
    } catch (e: any) {
      sendErrorResponse(e.message, res)
    }
  }
)

router.patch('/:task_id/complete/', async (req: AuthRequest, res: Response) => {
  try {
    const taskId = <string>req.params.task_id
    const userId = <string>req.userId
    const result = await service.taskStatusChange(userId, taskId, true)
    if (result.modifiedCount == 0) {
      return sendErrorResponse("can't update task", res)
    }
    sendSuccessResponse({ message: 'success' }, res)
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})
router.patch('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = <string>req.userId
    const taskId = <string>req.query.task_id
    const fields = <object>req.body
    if (userId && taskId && fields) {
      const updateResult = await service.updateOne(userId, taskId, fields)
      sendSuccessResponse(updateResult, res)
    }
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})
router.delete('/:task_id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId
    const taskId = <string>req.params.task_id
    if (userId && taskId) {
      const deleteResult = await service.deleteOne(userId, taskId)
      return sendSuccessResponse(deleteResult, res)
    }
    sendErrorResponse('absent user id or task id', res)
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})

router.post('/', async (req: AuthRequest, res: Response) => {
  const task: CreateTaskDTO = req.body
  if (!task) {
    return sendErrorResponse('Empty body', res)
  }
  const userId = <string>req.userId
  try {
    if (!userId) {
      return sendErrorResponse('no user id', res, 403)
    }
    await service.createTasks(task, userId)
    sendSuccessResponse(task, res)
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})

router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = <string>req.userId
  const taskId = <string>req.query.task_id
  try {
    if (!userId) {
      return sendErrorResponse('User id is absent', res, 403)
    }
    if (taskId) {
      const task = await service.getOne(userId, taskId)
      return sendSuccessResponse(task, res)
    }
    const tasks = await service.getAll(userId)
    sendSuccessResponse(tasks, res)
  } catch (e: any) {
    sendErrorResponse(e.message, res)
  }
})

export const tasksRouter = router
